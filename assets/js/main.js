/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
			$main.hide();
			$main_articles.hide();
			
			// Initial article.
			if (location.hash != '' && location.hash != '#')
			  $window.on('load', function() {
				$main._show(location.hash.substr(1), true);
			  });
			
			// OUR CUSTOM PAGINATION CODE STARTS HERE
			$(function() {

				// --- BEGIN CUSTOM PAGINATION LOGIC ---
				const workPagesIds = ['work', 'workpage2', 'workpage3', 'workpage4', 'workpage5', 'workpage6'];
				// This will store references to the actual article elements
				let workPageArticles = {}; 
				workPagesIds.forEach(id => {
					const el = document.getElementById(id);
					if (el) workPageArticles[id] = el;
				});

				let currentWorkPageIndex = 0;

				// Function to update the content and nav buttons of the CURRENTLY VISIBLE work article
				function displayContentForWorkPage(pageIndex) {
					console.log('displayContentForWorkPage for index:', pageIndex);
					currentWorkPageIndex = pageIndex;
					const activeArticleId = workPagesIds[pageIndex];
					const activeArticleElement = workPageArticles[activeArticleId];

					if (!activeArticleElement) {
						console.error('Active article element not found for id:', activeArticleId);
						return;
					}

					// --- This is where you would hide/show specific project items --- 
					// --- if each article (work, workpage2) itself contained ALL project items --- 
					// --- and you were just showing/hiding them. --- 
					// --- However, your HTML is structured so each article IS a page. --- 
					// --- So, the template's _show/_hide already handles showing the correct article. --- 
					// --- Our main job here is to update the Next/Prev buttons in the active article. ---

					// Update Next/Prev buttons within the activeArticleElement
					const prevButton = activeArticleElement.querySelector('.prev');
					const nextButton = activeArticleElement.querySelector('.next');

					if (prevButton) {
						if (pageIndex > 0) {
							prevButton.style.display = ''; // Show button
							prevButton.setAttribute('href', '#' + workPagesIds[pageIndex - 1]);
							console.log('Prev button href set to:', '#' + workPagesIds[pageIndex - 1]);
						} else {
							prevButton.style.display = 'none'; // Hide on first page
							console.log('Prev button hidden');
						}
					}

					if (nextButton) {
						if (pageIndex < workPagesIds.length - 1) {
							nextButton.style.display = ''; // Show button
							nextButton.setAttribute('href', '#' + workPagesIds[pageIndex + 1]);
							console.log('Next button href set to:', '#' + workPagesIds[pageIndex + 1]);
						} else {
							nextButton.style.display = 'none'; // Hide on last page
							console.log('Next button hidden');
						}
					}
					console.log('Buttons updated for article:', activeArticleId);
				}

				function handleHashChange() {
					const hash = window.location.hash.substring(1);
					console.log('Hash changed to:', hash);
					const pageIndex = workPagesIds.indexOf(hash);

					if (pageIndex !== -1) {
						// Check if the hash corresponds to one of our work pages
						console.log('Work page detected by hash:', hash, 'Index:', pageIndex);
						displayContentForWorkPage(pageIndex);
					} else {
						// If the hash is not a work page (e.g., #intro, #contact), 
						// we don't need to do pagination specific logic.
						// We might want to hide all pagination buttons if no work article is active.
						// For now, this is handled by the fact that displayContentForWorkPage
						// only runs if a work page hash is matched.
						console.log('Hash is not a work page:', hash);
					}
				}

				// Initial setup on page load
				handleHashChange(); 

				// Listen for hash changes
				$(window).on('hashchange', handleHashChange);

				// REMOVE PREVIOUS CUSTOM CLICK HANDLERS
				// $(document.body).off('click', '.next');
				// $(document.body).off('click', '.prev');

				console.log('Custom pagination logic initialized. Listening for hash changes.');

			});

})(jQuery);