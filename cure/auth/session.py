"""
Information about sessions:

A user can only have one session. Before setting a user id, all other sessions should be terminated.
Sessions do have an ID, which is an integer. This integer is generated randomly, and if another session
exists with this integer, the system will create a new one until it gets an unused integer.
"""
import time
import random
import cure.constants as constants


class Session:

    session_id = 0
    logged_in = False
    mfa_authenticated = True
    user_id = None
    terminated = False
    expires = time.time() + constants.AUTH_SESSION_EXPIRE_TIME
    time_created = time.time()

    def __init__(self, session_id):
        self.session_id = session_id

    def has_expired(self):
        """
        Determines if the session has expired
        :return: Whether or not the session expired
        """
        return time.time() > self.expires

    def terminate(self):
        """
        Terminates a session
        :return: Nothing
        """
        self.terminated = True
        self.logged_in = False
        self.mfa_authenticated = False


class SessionManager:

    def __init__(self):
        self.sessions = []

    def add_session(self, session):
        """
        Add a session
        :param session: Session to add
        :return: Nothing.
        """
        self.sessions.append(session)

    def terminate_all(self):
        """
        Terminate all sessions.
        :return: Nothing
        """
        for session in self.sessions:
            session.terminate()
        print("[Sessions] [INFO] All sessions have been terminated.")

    def logout(self, user_id):
        """
        Logs out any user currently logged in as a user.
        :param user_id: The user's id.
        :return: Nothing
        """

        for session in self.sessions:
            if session.logged_in and session.mfa_authenticated and not session.terminated:
                if session.user_id == user_id:
                    session.logged_in = False
                    session.mfa_authenticated = False

    def purge_sessions(self):
        """
        Purges sessions that have no purpose.
        :return: Nothing
        """
        for session in self.sessions:
            if session.has_expired():
                self.sessions.remove(session)
                continue
            if session.time_created > time.ctime(constants.AUTH_UNUSED_SESSION_REMOVAL_TIME) \
                    and not session.logged_in:
                self.sessions.remove(session)
                continue
            if session.terminated:
                self.sessions.remove(session)
                continue

    def generate_session(self):
        """
        Generates a session where there is no user logged in.
        :return: Session
        """
        random_range_start = 10 ** 16
        random_range_end = (10 ** 17) - 1
        session_id = random.randint(random_range_start, random_range_end)
        current_session_ids = [all_sessions.session_id for all_sessions in self.sessions]
        if session_id in current_session_ids:
            return self.generate_session()
        session = Session(session_id)
        self.sessions.append(session)
        return session

    def get_session(self, session_id):
        """
        Retrieve a session by an ID
        :param session_id: The session ID to look for
        :return: Session if a session exists with that ID, None if there isn't any.
        """
        for session in self.sessions:
            if session.session_id == int(session_id):
                return session
        return None

    def get_session_by_user_id(self, user_id):
        """
        Retrieve a session by user ID
        :param user_id: the user's ID to search for
        :return: Session (returns none if there is no session with that ID)
        """

        for session in self.sessions:
            if session.user_id == int(user_id):
                return session
        return None


session_manager = SessionManager()
