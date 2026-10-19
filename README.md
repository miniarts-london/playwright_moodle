# Moodle theme tests (Playwright)

Browser tests for the Synergy Learning Moodle theme (`theme_synergylearning`), run against a **local** Moodle site with [Playwright](https://playwright.dev/).

The tests log in once, save the session, and reuse it, so each test starts already logged in. Tests that need a visitor's view clear the session for themselves.

```
moodle-tests/
├── playwright.config.js     Site address (baseURL), and the setup + desktop projects
├── tests/
│   ├── auth.setup.js        Logs in once and saves the session to .auth/user.json
│   ├── homepage.spec.js     Site home: catalogue, about section, logged-out log in form
│   └── theme.spec.js        Footer: Contact button and address
├── .auth/                   The saved login session (ignored by git: never commit it)
└── package.json             @playwright/test
```

## Set up

1. Start your local Moodle and check it opens in the browser at the address in `playwright.config.js` (`baseURL`, currently `http://localhost:8080`).
2. Install Playwright and its browser, once:

   ```bash
   cd ~/Projects/Synegy_learning/moodle-tests
   npm install
   npx playwright install chromium
   ```

3. Use an account that exists on the **local** site. A dedicated test user is better than the admin account.

## Run the tests

The username and password are passed only for the command, so they are never saved in a file. Keep the password in single quotes, as `!` and other symbols are changed inside double quotes.

```bash
MOODLE_USER=testuser MOODLE_PASS='your-password' npx playwright test
```

| Command | What it does |
| --- | --- |
| `npx playwright test` | Runs everything: the log in first, then the tests |
| `npx playwright test tests/homepage.spec.js` | Runs one file |
| `npx playwright test --ui` | Opens the UI: run tests one by one and step through each action |
| `npx playwright test --headed` | Shows the browser while the tests run |
| `npx playwright test --debug` | Pauses before each action, so you can step through |
| `npx playwright show-report` | Opens the report of the last run |

Add `MOODLE_USER=… MOODLE_PASS='…'` in front of each of these, as in the first example. In UI mode, run **log in** first, and tick both the **setup** and **desktop** projects.

## Write new tests

Record actions with codegen, starting already logged in:

```bash
npx playwright codegen --load-storage=.auth/user.json "http://localhost:8080/?redirect=0"
```

Leave out `--load-storage=…` to record as a visitor who is not logged in. Use the toolbar's **Assert visibility** and **Assert text** to add checks, then copy the lines into a `test(...)` in a file in `tests/` ending in `.spec.js`. Leave out the recorded `page.goto(...)` line if a `beforeEach` already opens the page.

Tips:

- `page.goto('/?redirect=0')` opens the site home without Moodle sending logged-in users to the Dashboard.
- `test.use({storageState: {cookies: [], origins: []}})` inside a `test.describe` makes that group run logged out.
- A **strict mode violation** means a locator matched more than one element: add `{exact: true}`, or search inside a smaller area, for example `footer.locator('address')`.

## Troubleshooting

| Error | Cause | Fix |
| --- | --- | --- |
| `net::ERR_CONNECTION_REFUSED` | The local Moodle isn't running, or `baseURL` is wrong | Start it; copy the address from the browser into `baseURL` |
| `Moodle login error: Unable to log in` | Wrong username or password for the local site | Check them by logging in by hand; reset with `php admin/cli/reset_password.php` |
| A test lands on the log in page | The saved session expired | Run the tests again; the setup logs in afresh |
| `Executable doesn't exist` | Browser not installed | `npx playwright install chromium` |

Only run these tests against a local or test site. They log in and click through real pages, and repeated failed log ins can lock an account.
