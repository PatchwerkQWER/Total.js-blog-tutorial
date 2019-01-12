NEWSCHEMA('Login', function(schema) {

	schema.define('login', 'String', true);
	schema.define('password', 'String', true);

	schema.addWorkflow('login', function($) {

		var model = $.model.$clean();

		if (model.login === CONF.login && model.password === CONF.password) {

			var data = {
				hash: F.hash('sha256', '{0}:{1}'.format(CONF.login, CONF.password)),
				ip: $.controller.ip
			};
			var cookie = F.encrypt(data);

			$.controller.cookie(CONF.cookie, cookie, '6 days');
			$.controller.redirect('/admin/');
			return;
		}

		$.controller.redirect('/login/');
		$.invalid('error-login', 'Wrong login or password');
	});

});

AUTH(function(req, res, flags, callback) {

	var cookie = req.cookie(CONF.cookie);

	if (!cookie)
		return callback(false);

	var user = F.decrypt(cookie);
	var hash = F.hash('sha256', '{0}:{1}'.format(CONF.login, CONF.password));

	if (!user || user.ip !== req.ip || user.hash !== hash)
		return callback(false);

	req.user = true;
	callback(true);
});
