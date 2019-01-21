API_PREFIX = "/api"


class Routes:

    ROUTE_GET_TRACKERS = "/trackers"
    ROUTE_ADD_TRACKER = "/trackers/add"
    ROUTE_GET_TRACKER = "/trackers/<tracker_id>"
    ROUTE_DELETE_TRACKER = "/trackers/<tracker_id>/delete"
    ROUTE_GET_REPORT = "/trackers/<tracker_id>/report/<report_id>"
    ROUTE_GET_REPORTS = "/trackers/<tracker_id>/reports"
    ROUTE_AUTH_LOGIN = "/auth/login"
    ROUTE_AUTH_REGISTER = "/auth/register"
    ROUTE_AUTH_TOKEN_LOGIN = "/auth/token/generate-session"
    ROUTE_AUTH_TOKEN_GET = "/auth/token"
    ROUTE_AUTH_TOKEN_REFRESH = "/auth/token/refresh"
    ROUTE_AUTH_LOGOUT = "/auth/logout"
    ROUTE_AUTH_MFA = "/auth/mfa"
    ROUTE_AUTH_GET_SESSION_INFO = "/auth/session"

    def get_route(self, route):
        return API_PREFIX + route


ROUTES = Routes()

AUTH_SESSION_EXPIRE_TIME = float(86400)
AUTH_UNUSED_SESSION_REMOVAL_TIME = float(3600)

DATABASE_USERS_NAME = "user"