exports.error = (req,res,next) => {
   res.render('404', {pageTitle : 'Page Not Found', currentPage: '404', isLoggedIn:req.session.isLoggedIn, user: req.session.user });
}