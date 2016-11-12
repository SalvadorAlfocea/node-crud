module.exports = {

    // show the home page
    showHome: function(req, res) {
        res.status(200).render('pages/home');
    }

};