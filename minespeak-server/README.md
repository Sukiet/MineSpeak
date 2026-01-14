## About

```
┌─────────────────────────────┐
│ server.ts / index.ts        │  ← 程序入口 / 启动层
├─────────────────────────────┤
│ routes/                     │  ← HTTP 接口层（Controller）
├─────────────────────────────┤
│ services/                   │  ← 业务逻辑层（Service）
├─────────────────────────────┤
│ repos/                      │  ← 数据访问层（Repository）
├─────────────────────────────┤
│ models/                     │  ← 数据结构 / 类型定义
├─────────────────────────────┤
│ common/                     │  ← 全局工具 / 常量 / 基础设施
├─────────────────────────────┤
│ public/  views/             │  ← 静态资源 / 页面
└─────────────────────────────┘

```



This project was created with [express-generator-typescript](https://github.com/seanpmaxwell/express-generator-typescript).

**IMPORTANT** for demo purposes I had to disable `helmet` in production. In any real world app you should change these 3 lines of code in `src/server.ts`:
```ts
// eslint-disable-next-line n/no-process-env
if (!process.env.DISABLE_HELMET) {
  app.use(helmet());
}
```

To just this:
```ts
app.use(helmet());
```


## Available Scripts

### `npm run clean-install`

Remove the existing `node_modules/` folder, `package-lock.json`, and reinstall all library modules.


### `npm run dev` or `npm run dev:hot` (hot reloading)

Run the server in development mode.<br/>

**IMPORTANT** development mode uses `swc` for performance reasons which DOES NOT check for typescript errors. Run `npm run type-check` to check for type errors. NOTE: you should use your IDE to prevent most type errors.


### `npm test` or `npm run test:hot` (hot reloading)

Run all unit-tests.


### `npm test -- "name of test file" (i.e. users).`

Run a single unit-test.


### `npm run lint`

Check for linting errors.


### `npm run build`

Build the project for production.


### `npm start`

Run the production build (Must be built first).


### `npm run type-check`

Check for typescript errors.


## Additional Notes

- If `npm run dev` gives you issues with bcrypt on MacOS you may need to run: `npm rebuild bcrypt --build-from-source`. 
