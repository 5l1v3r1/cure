from cure.api.base import get_route
from cure.server import app
from cure.util.config import config
from flask import jsonify

import cure.constants as constants


@app.route(get_route(constants.ROUTES.ROUTE_GET_BOARD), methods=["GET"])
def get_board():
    cfg = config.read_config()
    return jsonify({
        "name": cfg.get("board_name", "invalid board name"),
        "private": cfg.get("board_private", False)
    })