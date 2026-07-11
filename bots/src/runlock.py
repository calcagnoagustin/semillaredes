"""P1 - Lock anti doble-corrida (fcntl.flock, stdlib).

Garantiza que solo una instancia de main() corra a la vez. Si el cron se
solapa o se dispara dos veces, la segunda sale limpia sin tocar nada.
"""
import os
import fcntl

LOCK_PATH = os.getenv("SEMILLAS_LOCK", os.path.join(os.path.dirname(__file__), ".semillas.lock"))


class LockBusy(Exception):
    pass


class run_lock:
    """Context manager. Levanta LockBusy si ya hay una corrida en curso."""

    def __init__(self, path=LOCK_PATH):
        self.path = path
        self._fh = None

    def __enter__(self):
        self._fh = open(self.path, "w")
        try:
            fcntl.flock(self._fh.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        except (BlockingIOError, OSError):
            self._fh.close()
            self._fh = None
            raise LockBusy("Ya hay una corrida en curso (lock tomado).")
        self._fh.write(str(os.getpid()))
        self._fh.flush()
        return self

    def __exit__(self, *exc):
        if self._fh is not None:
            try:
                fcntl.flock(self._fh.fileno(), fcntl.LOCK_UN)
            finally:
                self._fh.close()
                self._fh = None
        return False