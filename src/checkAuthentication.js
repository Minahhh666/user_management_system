// functions to check if user/admin is authenticated or not

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('not authenticated')
    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('already authenticated')
        return res.redirect('/user')
    }
    next()
}

function checkAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    console.log('not authenticated')
    res.redirect('/admin')
}

function checkNotAuthenticatedAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('already authenticated')
        return res.redirect('/admin/dashboard')
    }
    next()
}
module.exports = {checkAuthenticated, checkNotAuthenticated, checkAuthenticatedAdmin, checkNotAuthenticatedAdmin}