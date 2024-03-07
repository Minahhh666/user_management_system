function userRole(req) {
    // Assume there's some logic here to determine the appropriate redirect based on req.body
    if (req.body.role === 'admin') {
        return '/admin';
    } else {
        return '/user';
    }
}

module.exports = userRole;