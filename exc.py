import logging


class XenAdapterException(Exception):
    def __init__(self, message):
        logging.error("{0}: {1}".format(type(self).__name__, message))
        super().__init__()
        self.message = message


class XenAdapterConnectionError(XenAdapterException):
    pass


class XenAdapterAPIError(XenAdapterException):
    pass


class XenAdapterArgumentError(XenAdapterException):
    pass
