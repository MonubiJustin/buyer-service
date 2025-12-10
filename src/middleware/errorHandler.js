const errorHandler = (error, req, res, next) => {
    console.error(error)
    if (error.response && error.response.status === 404) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    
    return res.status(500).json({
        success: false,
        message: "Something went wrong"
    })
}

export { errorHandler };