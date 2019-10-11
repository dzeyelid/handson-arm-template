# ARMテンプレートハンズオン

## コンテンツ

- ARMテンプレートについて
- 環境準備
- セルフペース ハンズオン

## ARMテンプレートについて

## 環境準備

本ハンズオンに取り組むにあたり、下記の環境をご準備ください。 **\*** は必須です。

| 必要なもの | 説明 |
|----|----|
| Azureアカウント (**\***) | Azureポータル上で作業するので、サインインして利用できるサブスクリプションがあることをご確認ください。Azureアカウントをお持ちでない場合は、こちら [Azure の無料アカウントを今すぐ作成しましょう - Microsoft Azure](https://azure.microsoft.com/ja-jp/free/) から無料枠で利用できるアカウントを作成することができます。 |
| Webブラウザ (**\***) | Microsoft Edge, Google Chrome, Safari などをご利用ください。なお、Internet Explorer では Azureポータルがうまく動作しないことがあります。 |

なお、ARMテンプレートは JSON 形式で記述されています。JSON 形式について不安がある方はあらかじめ確認しておいてください。

お手元のマシン上で作業される場合は、下記も併せてご用意ください。

| 必要なもの | 説明 |
|----|----|
| Azure CLI | こちら [Azure CLI のインストール - Microsoft Docs](https://docs.microsoft.com/ja-jp/cli/azure/install-azure-cli?view=azure-cli-latest) を参考にインストールしてください。 |
| Visual Studio Code | 下記の拡張機能と組み合わせると ARMテンプレートの編集がとても楽になるので、おすすめしています。お持ちでない方は、こちら [Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/Download) からインストールしてください。 |
| Visual Studio Code 拡張機能「Azure Resource Manager Tools」 | https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools |

また、本手順は、 [Azure Cloud shell](https://docs.microsoft.com/ja-jp/azure/cloud-shell/overview) でも実施することができます。Cloud shell には、Azure CLI や Visual Studio Code ベースのエディタがすでに組み込まれています。また、ファイルをアップロードすることもできます。ファイルアップロードに関しては、こちら [Cloud Shell にローカル ファイルを転送する | Microsoft Docs](https://docs.microsoft.com/ja-jp/azure/cloud-shell/persisting-shell-storage#transfer-local-files-to-cloud-shell) をご参照ください。

## セルフペース ハンズオン

### 0. ハンズオン概要

ハンズオンでは、ARM Template によりStorage Account (Blob) と連携する Node.js アプリを Azure リソースとともにデプロイします。

![Structure](./docs/images/readme_010.png)

今回ハンズオンでは下記を実施します。

- App Service Plan とそのうえで実行される Azure Function (Linux) のプロビジョニング
- 二つの Azure Storage のプロビジョニング
- GitHub から Azure Functions に Node.js アプリをデプロイし、Azure Storage と連携

また、デプロイするアプリは、下記の機能を有しています。

- ユーザーから REST でリクエストを受けたら、リクエストごとに Storage Account (Blob) にデータを書き込む。
    - 書き込む内容は、HTTP クエリ文字列や POST のリクエストボディにて指定する。

大まかな手順は下記のとおりです。

1. Azureポータルから、ベースとなる ARMテンプレートをダウンロードする
2. ARMテンプレートを編集する
3. ARMテンプレートを使ってリソースをデプロイする
4. 動作確認を行う

### 1. Azureポータルから、ベースとなる ARMテンプレートをダウンロードする

[Azureポータル](https://portal.azure.com) で、左メニューの「 + Create a resource」を選択し、リソースの新規作成を開きます。

![Create a resource](./docs/images/readme_001.png)

検索欄で、 `Function App` と入力し、候補の「Function App」を選択します。

![Find Function App](./docs/images/readme_002.png)

Function App の「Create」ボタンを選択します。

![Create Function App](./docs/images/readme_003.png)

Function App 作成画面の Basics タブで各項目を入力し、「Next: Hosting >」を選択します。

| 項目 | 説明 |
|----|----|
| Subscription | 使用するサブスクリプションを選択する |
| Resource Group | 「Create new」を選択し、リソースグループ名を入力する |
| Function App name | Function App の名前を入力する |
| Publish | 「Code」を選択する |
| Runtime stack | 「Node.js」を選択する |
| Region | 「Japan East」を選択する |

![Input basics parameters for new Function App](./docs/images/readme_004.png)

もし、上図の画面と異なる場合は、下図のような案内から new experience を開いてください。(資料作成時点で Azureポータルが移行期間中であるための差異です。)

![Apply new experience](./docs/images/readme_005.png)

Hosting タブで各項目を入力し、「Next: Monitoring >」を選択します。

| 項目 | 説明 |
|----|----|
| Storage account | ストレージアカウント名を入力する（自動作成されたものでも、「Create new」から自身で入力しても構いません） |
| Operating System | 「Linux」を選択する |
| Plan type | 「App service plan」を選択する |
| Linux Plan (Japan East) | 「Create new」から Service plan の名前を入力する |
| Sku and size | 「Change size」を選択し、Dev/Test タブから B1 を選択し、「Apply」を選択する (OS が Linux の場合は B1 以上を選択する必要がある) |

![Input hosting parameters for new Function App](./docs/images/readme_006.png)

Monitoring タブで各項目を入力し、「Review + create」を選択します。

| 項目 | 説明 |
|----|----|
| Enable Application Insights | 「Yes」を選択する |
| Application Insights | 「Create new」から Application Insights の名前を入力し、Location に「Japan East」を選択し、「OK」を選択する |

![Input monitoring parameters for new Function App](./docs/images/readme_007.png)

入力したパラメータが表示されるので確認し、「 **Download a template for automation** 」を選択します。

![Check parameters for new Function App and go to download the template](./docs/images/readme_008.png)

「 **Download** 」を選択して、テンプレートをダウンロードします。

![Download the template](./docs/images/readme_009.png)

### 2. ARMテンプレートを編集する

ダウンロードしたARMテンプレートには、下記の二つのファイルが含まれています。

- parameters.json
- template.json

`template.json` はデプロイするリソースの詳細が定義されており、そのなかには入力させたいパラメータの定義も含まれます。そして、 `parameters.json` には、そのパラメータが定義されています。

`template.json` を開き、構成を確認してみましょう。下記のように、 `$schema`, `contentVersion`, `parameters`, `resources` という構成の JSON になっていることがわかります。テンプレートの構造の詳細については、こちら [Azure Resource Manager テンプレートの構造と構文 | Microsoft Docs](https://docs.microsoft.com/ja-jp/azure/azure-resource-manager/resource-group-authoring-templates) をご参考ください。

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "",
  "parameters": {  },
  "resources": [  ]
}
```

このままでも、上記の手順で設定した Azure Functions がデプロイできますが、さらに編集を加えてみましょう。

#### 2-1. ストレージアカウントをもう一つ追加する

リソースの定義の仕方については、 [Azure Resource Manager template reference - Azure template | Microsoft Docs](https://docs.microsoft.com/en-us/azure/templates/) に示されています。

この定義を参考に、ストレージアカウントをもう一つ追加してみましょう。

`template.json` を開き、 `resources` の配列に、下記を追加します。直前のリソース定義にたいして、 `,` を続け、JSONの配列の記法に沿うように注意してください。

```json
,
{
  "name": "[parameters('storageNameForLog')]",
  "type": "Microsoft.Storage/storageAccounts",
  "apiVersion": "2019-04-01",
  "sku": {
    "name": "[parameters('storageSkuNameForLog')]"
  },
  "kind": "StorageV2",
  "location": "[resourceGroup().location]",
  "resources": [
    {
      "name": "[concat('default/', parameters('storageContainerNameForLog'))]",
      "type": "blobServices/containers",
      "apiVersion": "2019-04-01",
      "properties": {
        "publicAccess": "None"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageNameForLog'))]"
      ]
    }
  ]
},
{
}
```

そして、このストレージアカウントはふたつのパラメータを参照するように記述されています。このパラメータについて定義を追加しましょう。 `parameters` のオブジェクトに、下記を追加して下さい。（既存のパラメータ定義に `,` が続くように追加することにご注意ください。）

```json
,
"storageNameForLog": {
  "type": "string"
},
"storageSkuNameForLog": {
  "type": "string",
  "allowedValues": [
      "Standard_LRS",
      "Standard_GRS",
      "Standard_RAGRS",
      "Standard_ZRS",
      "Premium_LRS",
      "Premium_ZRS",
      "Standard_GZRS",
      "Standard_RAGZRS"
  ]
},
"storageContainerNameForLog": {
  "type": "string",
  "defaultValue": "logs"
}
```

##### 2-1. 解説

ストレージアカウントを追加するために、 [Microsoft.Storage/storageAccounts 2019-04-01 - Azure template | Microsoft Docs](https://docs.microsoft.com/en-us/azure/templates/microsoft.storage/2019-04-01/storageaccounts) を確認しましょう。

ストレージアカウント名等のパラメータを定義する
リソースを追加する

#### 2-2. Azure Functions のアプリ設定 (Application settings) を更新する

次に、 Azure Functions の設定を追加します。

Azure FUnctions のリソース定義は `"type": "Microsoft.Web/sites"` と定義されているオブジェクトです。

このオブジェクトの `properties.siteConfig.appSettings` の配列に、下記を追加してください。

```json
,
{
  "name": "WEBSITE_NODE_DEFAULT_VERSION",
  "value": "10.14.1"
},
{
  "name": "WEBSITE_RUN_FROM_PACKAGE",
  "value": "https://github.com/dzeyelid/handson-arm-template/blob/develop/functions.zip?raw=true"
},
{
  "name": "StorageAccountConnStrLog",
  "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', parameters('storageNameForLog'), ';AccountKey=', listKeys(parameters('storageNameForLog'),'2019-04-01').keys[0].value)]"
}
```

##### 2-2. 解説

###### Node.js バージョンを指定する

Node.js のバージョンを指定するには、 Application settings の `WEBSITE_NODE_DEFAULT_VERSION` を設定します。選択できるバージョンはいくつかありますが、ドキュメントで推奨されている `10.14.1` を指定しましょう。

- 参考: [Azure Functions 用 JavaScript 開発者向けリファレンス | Microsoft Docs](https://docs.microsoft.com/ja-jp/azure/azure-functions/functions-reference-node#node-version)

###### Run from package でソースコードをデプロイさせる

Application settings に `WEBSITE_RUN_FROM_PACKAGE` を設定すると、 _Run from package_ というパッケージからコードを実行できる機能を指定できます。値に zip ファイルのURLを指定することで zip に含まれたソースコードをデプロイすることができます。

- 参考: [Azure Functions をパッケージから実行する | Microsoft Docs](https://docs.microsoft.com/ja-jp/azure/azure-functions/run-functions-from-deployment-package#enabling-functions-to-run-from-a-package)

この手順では、このリポジトリでホストしている zip アーカイブされたソースコードを指定しています。

###### ストレージアカウントの接続文字列を設定する

https://docs.microsoft.com/ja-jp/azure/azure-resource-manager/resource-group-template-functions

### 3. ARMテンプレートを使ってリソースをデプロイする

ARMテンプレートを使ったデプロイをするために、今回は Azure CLI を利用します。インストールした Azure CLI を利用できる Command prompt, bash などのターミナルを開いて作業を進めてください。手順では Command prompt を利用します。ターミナルによって改行の文字が異なるので、適宜読み替えてください。

まずは、リソースグループを作成しましょう。今回ダウンロードしたテンプレートでは、 `<Resource group name>` には、前述の手順で Azureポータルで指定したリソースグループ名を指定する必要があります。（テンプレートを自作した場合はこの限りではありません。）

```cmd
# リソースグループを作成する
az group create ^
  --name <Resource group name> ^
  --location japaneast
```

さて、追加したストレージアカウントのパラメータは、 `parameters.json` に加えてもよいですが、ここでは `az` コマンドの引数から渡してみましょう。

下記のコマンドを実行します。 `<Resource group name>`, `<Storage account name>` は適宜置換えてください。

```cmd
# template.json があるディレクトリへ移動する
cd <Directory path that has template.json>

# パラメータを指定し、デプロイを実行する
az group deployment create ^
  --resource-group <Resource group name> ^
  --template-file template.json ^
  --parameters @parameters.json ^
  --parameters ^
    storageNameForLog=<Storage account name> ^
    storageSkuNameForLog=Standard_LRS
```

### 4. 動作確認を行う

Azure Functions に HttpTrigger という関数がデプロイされているので、これを実行すると、追加した方のストレージアカウントの logs コンテナにログが出力されます。この動作が確認できればデプロイ成功です。
