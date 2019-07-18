exports.getone = function(req, res) {
    try {
        res.send("hola mundo")
    } catch (error) {
        console.log(error);
    }
}