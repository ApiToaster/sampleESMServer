# ApiToaster - sample ESM server

## 1. How to start

### Install dependencies

```shell
npm install / yarn
```

### Prepare environment

## 2. How to build

```shell
npm run build / yarn build
```

If you even encounter strange build behavior, tsconfig is set to create build with cache. Set option `incremental` in tsConfig to false

## 3. Useful information

### 3.1 Logs folder

#### Linux

```text
~/.cache/"package.json -> productName"/logs
```

#### Windows

```text
~/AppData/Roaming/"package.json -> productName"/logs
```