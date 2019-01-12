exports.install = function() {

	ROUTE('GET /                           *Post', view_index);
	ROUTE('GET /post/{id}/                 *Post', view_post);

	ROUTE('POST /comment/add/              *Comment', add_comment);

	ROUTE('GET /login/                     ', view_login, ['unauthorized']);
	ROUTE('POST /login/                    *Login --> @login');

	GROUP(['authorized'], function() {
		ROUTE('POST /post/add/            *Post --> @insert');
		ROUTE('POST /post/update/         *Post --> @update');
		ROUTE('GET /post/remove/{id}/     *Post --> @remove');

		ROUTE('GET /login/                ', view_admin);
		ROUTE('GET /admin/                *Post', view_admin);
		ROUTE('GET /logout/               ', logout);
	});

};

function view_index() {
	var self = this;

	self.$query(function(err, response) {

		var pagination = new Pagination(response.count, response.page, 5);
		response.pagination = U.parseJSON(pagination.json());

		self.view('index', response);
	});
}

function view_post(post) {
	var self = this;
	self.id = post;

	self.$get(function(err, response) {
		if (err) {
			self.throw404();
			return;
		}

		self.view('detail', response);
	});
}

function add_comment() {
	var self = this;

	self.$insert(function(err, response) {
		if (err) {
			self.throw404();
			return;
		}

		self.redirect('{0}#{1}'.format(self.req.headers.referer, response.value));
	});
}

function view_login() {
	var self = this;
	self.view('login');
}

function view_admin() {
	var self = this;

	if (self.query.id && self.query.id.isUID()) {
		self.$get(function(err, response) {
			if (err || !response) {
				self.throw404();
				return;
			}

			self.view('update', response);
		});
		return;
	}
	self.view('add');
}

function logout() {
	var self = this;

	self.res.cookie(CONF.cookie, '', F.datetime.add('-1 day'));
	self.redirect('/');
}
