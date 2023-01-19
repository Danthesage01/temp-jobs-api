const getHome = async (req, res) =>{
res.status(200).send("<h1>Jobs API</h1><a href='/api-docs'>Documentation</a>")
}

module.exports = getHome