# Convex Chat

This is an app bootstrapped according to the [init.tips](https://init.tips) stack, also known as the T3-Stack.

## Why are there `.js` files in here?

As per [T3-Axiom #3](https://github.com/t3-oss/create-t3-app/tree/next#3-typesafety-isnt-optional), we take typesafety as a first class citizen. Unfortunately, not all frameworks and plugins support TypeScript which means some of the configuration files have to be `.js` files.

We try to emphasize that these files are javascript for a reason, by explicitly declaring its type (`cjs` or `mjs`) depending on what's supported by the library it is used by. Also, all the `js` files in this project are still typechecked using a `@ts-check` comment at the top.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with the most basic configuration and then move on to more advanced configuration.

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Convex](https://www.convex.dev/)
- [Next-Auth.js](https://next-auth.js.org)
- [TailwindCSS](https://tailwindcss.com)
## Deployment?
We use Github Actions to deploy to [Vercel](https://www.vercel.com) via CLI. Therefore, your built code does not live on Vercel.

Just setup import this project into Vercel and provide the following secrets in your forked Github repo:
   - **CONVEX_ADMIN_KEY**
      - [Convex Admin Key](https://dashboard.convex.dev/)
   - **VERCEL_TOKEN**
      - [Your Vercel token](https://vercel.com/account/tokens)
   - **NEXTAUTH_URL**
      - Your project's domain URL
   - **GIT_ID**
      - Your Github App ID. Check [NextAuth](https://next-auth.js.org/providers/github) documentation on how to configure
   - **GIT_SECRET**
      - Your Github App Secret. Check [NextAuth](https://next-auth.js.org/providers/github) documentation on how to configure

If you're unfamilar with adding secrets to your repo here's the [guide](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-encrypted-secrets-for-your-repository-and-organization-for-github-codespaces)