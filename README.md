# A :construction_worker: handyman to help you out with :octocat: GitHub :construction: side work

[![Build Status](https://travis-ci.org/hfreire/github-handyman.svg?branch=master)](https://travis-ci.org/hfreire/github-handyman)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/github-handyman/badge.svg?branch=master)](https://coveralls.io/github/hfreire/github-handyman?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/hfreire/github-handyman/badge.svg)](https://snyk.io/test/github/hfreire/github-handyman)
[![](https://img.shields.io/github/release/hfreire/github-handyman.svg)](https://github.com/hfreire/github-handyman/releases)

> Uses an [AWS Lambda](https://aws.amazon.com/lambda) to periodically look at your [GitHub](https://github.com/) repository pull requests and get them ready to be shipped.
### Features
* Automatically review, approve and merge your pull requests :white_check_mark:
* Supports [Dependabot](https://dependabot.com) pull requests :white_check_mark:
* Supports [Greenkeeper](https://greenkeeper.io) pull requests :white_check_mark:
* Uses [GitHub Wrapper](https://github.com/dog-ai/github-wrapper) :octocat: :white_check_mark:

### How to deploy

#### Deploy it from your terminal
Deploying it from your terminal requires [terraform](https://www.terraform.io) installed on your system and an [antifragile infrastructure](https://github.com/antifragile-systems/antifragile-infrastructure) setup available in your [AWS](https://aws.amazon.com) account.

##### Clone the GitHub repo
```
git clone https://github.com/hfreire/github-handyman.git
```

##### Change current directory
```
cd github-handyman
```

##### Run the NPM script that will deploy all functions
```
npm run deploy
```

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### License
Read the [license](./LICENSE.md) for permissions and limitations.
