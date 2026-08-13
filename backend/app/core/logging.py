import time
import logging
import functools
from typing import Callable, Any, Optional
from contextvars import ContextVar

# ContextVar to store request correlation IDs for distributed tracing
correlation_id: ContextVar[Optional[str]] = ContextVar("correlation_id", default=None)

class StructuredFormatter(logging.Formatter):
    """
    Custom formatter that adds context parameters like correlation_id.
    """
    def format(self, record: logging.LogRecord) -> str:
        # Inject correlation_id if present in context
        c_id = correlation_id.get()
        record.correlation_id = c_id if c_id else "N/A"
        return super().format(record)

def setup_logging(env: str = "development") -> None:
    """
    Configures application-wide logging with structured formats.
    """
    log_level = logging.INFO if env == "development" else logging.WARNING
    
    # Custom format including correlation_id for request tracing
    log_format = "%(asctime)s [%(levelname)s] [Trace: %(correlation_id)s] %(name)s: %(message)s"
    
    handler = logging.StreamHandler()
    formatter = StructuredFormatter(log_format)
    handler.setFormatter(formatter)
    
    root_logger = logging.getLogger()
    # Clear existing handlers to avoid duplicates
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level)

def get_logger(name: str) -> logging.Logger:
    """
    Helper function to get a logger instance.
    """
    return logging.getLogger(name)

def log_duration(stage: str, document_id: Optional[str] = None):
    """
    A unified, thread-safe decorator and context manager to measure and log execution latency.
    
    Usage as decorator:
        @log_duration("PDF extraction")
        def extract_pdf(...):
            ...
            
    Usage as context manager:
        with log_duration("Qdrant query", doc_id):
            # perform query
    """
    class DurationContext:
        def __init__(self):
            self.start_time = 0.0
            self.logger = logging.getLogger("app.core.logging.duration")

        def __enter__(self):
            self.start_time = time.perf_counter()
            doc_info = f" for document {document_id}" if document_id else ""
            self.logger.info(f"Starting {stage}{doc_info}")
            return self

        def __exit__(self, exc_type, exc_val, exc_tb):
            duration = time.perf_counter() - self.start_time
            doc_info = f" for document {document_id}" if document_id else ""
            if exc_type:
                self.logger.error(
                    f"Failed {stage}{doc_info} | "
                    f"Error: {exc_type.__name__}: {exc_val} | Duration: {duration:.4f}s"
                )
            else:
                self.logger.info(
                    f"Completed {stage}{doc_info} | Duration: {duration:.4f}s"
                )
            return False  # Do not suppress exceptions

    # This wrapper supports both the 'with' statement and callable decorators
    class DecoratorOrContext:
        def __enter__(self):
            self.ctx = DurationContext()
            return self.ctx.__enter__()

        def __exit__(self, exc_type, exc_val, exc_tb):
            return self.ctx.__exit__(exc_type, exc_val, exc_tb)

        def __call__(self, func: Callable[..., Any]) -> Callable[..., Any]:
            @functools.wraps(func)
            def wrapper(*args: Any, **kwargs: Any) -> Any:
                ctx = DurationContext()
                with ctx:
                    return func(*args, **kwargs)
            return wrapper

    return DecoratorOrContext()
