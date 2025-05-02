class JSendResponse {
    static success(data, statusCode = 200) {
        return {
            status: "success",
            data
        };
    }

    static fail(data, statusCode = 400) {
        return {
            
            status: "fail",
            data
        };
    }

    static error(message,  statusCode = 500) {
        return {
            status: "error",
            message,
            
        };
    }
}

module.exports = JSendResponse;