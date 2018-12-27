exports.install = function() {
	ROUTE('/', view_index);
	ROUTE('/detail', view_detail);
};

function view_index() {
	var self = this;
	self.view('index');
}

function view_detail() {
	var self = this;
	self.view('detail');
}
