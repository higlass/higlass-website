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
