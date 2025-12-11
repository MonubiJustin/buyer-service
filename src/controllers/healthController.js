export const health = (req, res) => {
    // In a real application, you would perform acual health checks
    const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: [
            { name: 'Database', status: "Healthy", responseTimeMs: 10 },
            { name: "External API", status: "Unhealthy", responseTimeMs: 500 },
            {name: "Cache Server", status: "Healthy", responseTimeMs: 5}
        ]
    }

    // render the 'health' EJS template and pass the healthdata object
    res.render("health", {health: healthData})
}