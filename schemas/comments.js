NEWSCHEMA('Comment', function(schema) {

	schema.define('id', 'UID');
	schema.define('postid', 'UID', true);
	schema.define('author', 'String(24)', true);
	schema.define('message', 'String(512)', true);
	schema.define('created', 'Date');

	schema.setInsert(function($) {
		var model = $.model.$clean();
		var nosql = NOSQL('comments');

		model.id = UID();
		model.created = F.datetime;

		nosql.insert(model).callback(function(err) {
			if (err) {
				$.invalid('comment-insert-fail', 'Comment insert error');
				return;
			}

			$.success(true, model.id);
		});
	});

});
