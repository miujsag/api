const { Site, Article, Day, Weather, Rate, Category } = require("db");
const { search, createSearchClient } = require("search");
const { createLogMessage } = require("logger");
const { toList } = require("./helpers");
const client = createSearchClient(process.env.HOST, process.env.LOG);

async function init(request, response, next) {
  try {
    const sites = await Site.lists();
    const categories = await Category.lists();
    const [day, weather, rates] = await Promise.all([
      Day.today(),
      Weather.getBy({ city: "Budapest" }),
      Rate.lists(1),
    ]);

    response.json({
      day,
      weather,
      rates,
      categories,
      sites,
    });
  } catch (error) {
    next(
      new Error(
        createLogMessage({
          page: "news",
          error: error.message,
        })
      )
    );
  }
}

async function index(request, response, next) {
  try {
    const siteIds = toList(request.query.sites);
    const categoryIds = toList(request.query.categories);
    const until = request.query.until || new Date();
    const { rows, count } = await Article.lists(
      siteIds,
      categoryIds,
      until,
      20
    );

    response.json({
      count,
      articles: rows,
    });
  } catch (error) {
    next(
      new Error(
        createLogMessage({
          page: "api/index",
          error: error.message,
        })
      )
    );
  }
}
function searchArticles(request, response, next) {
  const query = request.query.query || "";
  const siteIds = toList(request.query.sites);
  const categoryIds = toList(request.query.categories);
  const from = request.query.from;
  const until = request.query.until;
  const skip = request.query.skip;
  const sort = request.query.sort;
  search(client, query, siteIds, categoryIds, from, until, skip, sort)
    .then(({ articles, total }) => {
      response.json({ articles, total: total.value });
    })
    .catch((error) => {
      next(
        new Error(
          createLogMessage({
            resource: "search",
            error: error.message,
          })
        )
      );
    });
}
module.exports = {
  init,
  index,
  search: searchArticles,
};
