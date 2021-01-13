# Contributing Guidelines

- [Context](#context)
- [Technical Requirements](#tech-requirements)
- [Getting Started](#getting-started)
- [Development](#development)
    - [Boy Scout Developer](#boy-scout-developer)
    - [JavaScript](#js)
    - [CSS and Styling](#css)
    - [HTML and Templates](#html)
- [Version Control](#version-control)
  - [Workflow](#workflow)
  - [Branch Naming Conventions](#branch-naming-conventions)
  - [Pulling from Remote Branches](#pulling-from-remote-branches)
  - [Committing to Git](#committing-to-git)
  - [Commit Message Guidelines](#commit-message-guidelines)


---


<a name="context"></a>
## Context

This project has been built with the Apostrophe Boilerplate v2.x. For more documentation on Apostrophe, visit their [documentation site](https://docs.apostrophecms.org/).


---


<a name="tech-requirements"></a>
## Technical Requirements

- [Yarn](https://yarnpkg.com/)

- [Node.js](https://nodejs.org/en/) (and possibly [NVM](https://github.com/nvm-sh/nvm))

- [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)


---


<a name="getting-started"></a>
## Getting Started

1. [Clone this repository](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) to your local machine

2. Use NVM to match the [`engines` property in `package.json`](https://docs.npmjs.com/cli/v6/configuring-npm/package-json#engines)

3. From a Terminal instance, run `yarn` to install the dependencies

4. Obtain a copy of the database and the assets from an admin.  
  ⚠️ This requires that you have agreed with them beforehand.
    - Unzip the assets so they become the `public/uploads` directory
    - With the `*.tgz` database backup at the root of the project, run `mongorestore --gzip --archive=<filename> --drop` from a Terminal instance

5. From a Terminal instance, run `yarn dev`

6. Open a browser, and go to <http://localhost:3000/>


---


<a name="development"></a>
## Development

<a name="boy-scout-developer"></a>
### Boy Scout Developer

[Boy Scouts](https://www.scouting.org/) are supposed to leave a camping site in a better shape than it was when they arrived.

As such, developers also have that responsibility: leave the files onto which they worked in a better shape than they found it.

Obviously, this should apply only to the files onto which they work, so the scope of the work being done does not expand indefinitely. Any potential improvement discovered that are bigger than a quick fix should be listed in the project backlog.


<a name="js"></a>
### JavaScript


#### Clarity Over Cleverness

Since development is a team effort, whether with current teammates, future teammates, or even your future self, you should always prefer clarity over cleverness. In broad strokes, this means ensuring to name your variables and methods in a constant and legible manner (e.g. avoiding one-letter variables), avoiding [ternary expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) unless absolutely necessary, ensuring to add comments, etc.

Unless a necessary performance improvement is obtained by writing clever code that is complicated to read, it is best to avoid it. In the situation where it is necessary, ensure that you add appropriate comments to help your teammates.


#### JavaScript Coding Style

Standardization of the coding style ensures that anyone understands the rules of engagement when joining the project. Ensure to you follow those rules as you develop.

See `.eslintrc.json` for the [ESLint rules](https://eslint.org/docs/rules/) applied to this project, and also the `.editorconfig` files. Many IDEs implement linting functionalities. We leave those details to you.


<a name="css"></a>
### CSS and Styling

#### Do Not Style HTML Elements Directly

Styles should be independent from [HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element). The main reason for this is reusability, but also SEO, and accessibility.

- **Reusability**: Declaring a style directly—e.g. on an `<button>`—locks this style on this element, which may need to change according to context. What if an `<a>` needs to visually look identical to that button?  
  Styles should be declared in classes—e.g. `.btn`—that can be reused and applied to whichever element. Those styles could then be extended—e.g. `<a class="btn btn-primary">`— so that their looks are appropriate to their context.  
  Ideally, those styles should even be declared in mixins for better reusability.

- **SEO and accessibility**: SEO ranking and accessibility depend on the semantics of the elements used, not on the style applied to them. As such, it should be easily possible to swap elements—e.g. an `<h2>` for `<div>`—to be able to change the semantic meaning of the content, without changing its styling.  
  See the templates guidelines below for more details.


#### Do Not Style HTML Element IDs Directly

The `id` attribute of an HTML element is meant to create a variable so the element becomes reachable via JavaScript.

Instead, create a class, even if it is unique, for the element you would have styled with its `id`.


#### Create Reusable Variables

[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) coding should also apply to CSS. Breakpoints, colors, typography, components, etc. should as much as possible be defined once, and then imported, reused, and extended as needed.


#### CSS Naming Conventions

In order to be consistent, CSS styling should also follow naming conventions. In short:

- Use `lowerCamelCase` for `id`

- Use `snake-case` for `class`

e.g.:

```html
<button
  id="clickableButton"
  class="btn btn-primary"
>
  Click here to click
</button>
```


<a name="html"></a>
### HTML and Templates

There may be different ways and languages that render templates: [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [PHP](https://www.php.net/), [Twig](https://twig.symfony.com/), [Mustache](https://mustache.github.io/), etc. While they all have their idiosyncracies, they all intend to render HTML in a browser. The following guidelines make no distinction between those technologies and apply to all of them.


#### Accessibility (A11Y) and Semantics

First and foremost, content on the web is about semantics, its meaning. As such, it is important to use appropriate [HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) according to the intent of the content to display. This impacts not only SEO, but also accessibility.

Here are some rules of thumb:

- Styling should never be defined by the HTML element used, this is the job of CSS.

- All HTML content should be completely navigable by keyboard.

- [Images](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Img) should always have an `alt` [attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Img#Attributes), even if empty.

- *Do not* freely interchange headings (`<h1>`, `<h2>`, etc.) because you need bigger text or a subtitle.  
  *Do* use headings to structure content.

- *Do not* use `<a href="#">` to trigger a JavaScript function on a page.  
  *Do* use a button.

    - [Hyperlinks](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) lead to another page

    - [Buttons](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) do something on the same page

Read more about semantics and accessibility:

- [HTML: A good basis for accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML)

- [Semantic HTML](https://internetingishard.com/html-and-css/semantic-html/)

- [30 Best HTML5 Best Practices](https://www.themelocation.com/best-html5-practices/)


#### Cleanliness and Legibility

HTML tags can have multiple attributes added onto them. As such, lines can become quite long and unpleasant to investigate.

Ensure to break attributes onto different lines so that it can be easier to read, but also so that it is easier to see what changed when looking at the revision history.

```html
<!--- avoid --->
<button id="clickableButton" class="btn btn-primary" onclick="onButtonClicked" onhover="onButtonHovered" disabled="false" data-value-1 data-value-2>Click here to click</button>

<!--- prefer --->
<button
  id="clickableButton"
  class="btn btn-primary"
  onclick="onButtonClicked"
  onhover="onButtonHovered"
  disabled="false"
  data-value-1
  data-value-2
>
  Click here to click
</button>
```


#### Avoid Logic In Template

With the proliferation of prerendered templates and JavaScript frameworks, it is more and more possible to render things conditionally in HTML.

This however oftentimes comes at the expense of legibility:

```html
<!--- avoid --->
<button
  disabled="{ model.parameter.value > model.otherParameter.value ? model.context.value : model.otherContext.value }"
>
  Click here to click
</button>
```

Ideally, declare all this logic in a method, and only use this method in the template. This makes the template more legible, and it also allows to create unit tests for this method.

```html
<!--- prefer --->
<button
  disabled="{!isButtonEnabled()}"
>
  Click here to click
</button>

<script>
// model would be defined elsewhere
function isButtonEnabled() {
  let isEnabled = false;
  if (model.parameter.value > model.otherParameter.value) {
    isEnabled = model.context.value;
  } else {
    isEnabled = model.otherContext.value;
  }
  return isEnabled;
}
</script>
```


---


<a name="version-control"></a>
## Version Control


<a name="workflow"></a>
### Workflow

This project follows the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow). In short:

- The `master` branch is work that is always functional to be pushed to a production server.

- The `develop` branch is where work happens until the admin chooses to create a release.

- [Feature branches](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) are where each developer should work, branching off of the `develop` branch, so that their changes are isolated and reviewed before being merged into the ongoing `develop` branch.

- Contributors should always submit their work for review with a [pull request (PR)](https://help.github.com/articles/about-pull-requests/) and **never push work directly to either the `develop` or `master` branch**. Code administrators are responsible for reviewing PRs and are the only ones allowed to make direct commits to the main branches.


<a name="branch-naming-conventions"></a>
### Branch Naming Conventions

Ensure to standardize the branch names when creating a branch from `develop`. Below is the expected structure:

```
<username>/<issueNumber>-<action>
```

Here is a breakdown of the naming structure shown above:

- `<username>`: Your username, e.g. "**mjanson/**".  
  This sorts the feature branches relative to who is working on it.  
  If there are more than one developer working on the feature branch, either user the name of the principal developer, or simply use "**feature/**" instead of the username.

- `<issueNumber>`: Issues addressed should ideally have an entry in the [issue list on GitHub](https://github.com/jansensan/arts-et-medias/issues). This allows to have a space to discuss the work to be done or completed.

- `<action>`: The task which will be addressed, in _imperative form_, in the _present tense_. Ensure to use a short telegraphic sentence to describe the task.  


#### Additional Notes

- Ensure to use dashes ("-") and not underscores to separate words.

- Branch names should be in lowercase.


#### Examples

- mjanson/72-fix-header-search-form

- feature/123-add-spanish-translation


<a name="pulling-from-remote-branches"></a>
### Pulling from Remote Branches

Ensure that you [rebase](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/github-glossary#rebase) when [pulling](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/github-glossary#pull) work from the remote branches, so as to avoid a superfluous merge commits.


<a name="committing-to-git"></a>
### Committing to Git

- Git commits must be related to either an issue or a task, or at least with an explicit intention.

- **Do not** simply commits a lot of changes at once that cover too many concerns.

- **Do not** simply push commits to the `develop` branch, work from a feature branch, and then ask for a [pull request (PR)](https://help.github.com/articles/about-pull-requests/).


<a name="commit-message-guidelines"></a>
### Commit Message Guidelines

![XKCD comic showing useless commit messages](https://imgs.xkcd.com/comics/git_commit.png)

<small>Image: [XKCD - Git Commit](https://xkcd.com/1296/)</small>

For commits to be understood properly by all, here are some guidelines to write commit messages:

- A **short** explanation of the work done, in **sentence case**, without a period at the end:
    > Fixed broken parsing

- Write in **past tense**:
    > Fixed this issue

    not

    > Fix this issue

- In the case where you need to add more details, keep the message short, and add the details in the commit body.

See the [Git documentation](https://git-scm.com/docs/git-commit) as needed.
