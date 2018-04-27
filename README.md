# HiGlass Website

> Fast Contact Matrix Visualization for the Web.

**URL**: http://higlass.gehlenborglab.org

**Note**: This is the source code for the website only! The source code of the actual HiGlass app can be found at https://github.com/hms-dbmi/higlass.

## Development

**Installation:**

```bash
$ git clone --recursive https://github.com/hms-dbmi/higlass-website
$ npm install
```

**Note**: If you forgot to add `--recursive` do the following to pull the submodules

```
$ git submodule update --init --recursive --remote
```

In order to update the wiki run:

```
$ git submodule update --recursive --remote
```

**Developmental server:**

```bash
$ npm start
```

**Production build:**

```bash
$ npm run build
```

**New version:**

```bash
$ npm version <major|minor|patch> && git push --tags
```

**Update wiki:**

```bash
$ npm run update-wiki
```

## Dark Theme

You like dark themes? We too! But it's experimental so if anything happens we can't help you.
If you still want to go ahead please open the developer console and turn the lights off:

```
// You can do it!
hgw.lightsOff()
// Uh it's nice and dark here!
// ...
// I am a little scared let's turn those lights on again.
hgw.lightsOn()
```

