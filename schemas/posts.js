NEWSCHEMA('Post', function(schema) {

	schema.define('id', 'UID');
	schema.define('slug', 'String(70)');
	schema.define('title', 'String(128)');
	schema.define('content', 'String');
	schema.define('created', 'Date');

	schema.setQuery(function($) {
		var nosql = NOSQL('posts').listing();
		var query = $.query;

		nosql.paginate(query.page, 5);
		nosql.sort('created', true);

		nosql.callback($.callback);
	});

	schema.setGet(function($) {

		var nosql = NOSQL('posts').one();
		var join = nosql.join('comments', 'comments');

		join.on('postid', 'id');
		join.sort('created', true);

		$.id && nosql.where('slug', $.id);
		$.query.id && nosql.where('id', $.query.id);

		nosql.callback($.callback, 'error-post-404');
	});

	schema.setInsert(function($) {

		var model = $.model.$clean();
		var nosql = NOSQL('posts');

		model.id = UID();
		model.slug = '{0}-{1}'.format(U.GUID(5), model.title.slug());
		model.created = F.datetime;

		nosql.insert(model).callback(function(err) {
			if (err) {
				$.invalid('insert-fail', 'Insert error');
				return;
			}

			$.controller.redirect('/post/{0}'.format(model.slug));
			$.success();
		});
	});

	schema.setUpdate(function($) {

		var model = $.model.$clean();
		var nosql = NOSQL('posts');

		model.slug = '{0}-{1}'.format(U.GUID(5), model.title.slug());
		model.created = F.datetime;

		nosql.modify(model).where('id', model.id).callback(function(err) {
			if (err) {
				$.invalid('update-fail', 'Update error');
				return;
			}

			$.controller.redirect('/post/{0}'.format(model.slug));
			$.success();
		});
	});

	schema.setRemove(function($) {

		var nosql = NOSQL('posts');

		if (!$.id.isUID()) {
			$.invalid('remove-fail', 'Remove error');
			return;
		}

		nosql.remove().where('id', $.id).callback(function(err) {
			if (err) {
				$.invalid('remove-fail', 'Remove error');
				return;
			}

			$.controller.redirect('/');
			$.success();
		});

	});

});
