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

### ハンズオン概要

ハンズオンでは、ARM Template によりStorage Account (Blob) と連携する Node.js アプリを Azure リソースとともにデプロイします。

![Structure](./docs/images/readme_010.png)

今回ハンズオンでは下記を実施します。

- App Service Plan とそのうえで実行される Azure Function (Linux) のプロビジョニング
- 二つの Azure Storage のプロビジョニング
- GitHub から Azure Functions に Node.js アプリをデプロイし、Azure Storage と連携

また、デプロイするアプリは、下記の機能を有しています。

- ユーザーから REST でリクエストを受けたら、リクエストごとに Storage Account (Blob) にデータを書き込む。
    - 書き込む内容は、HTTP クエリ文字列や POST のリクエストボディにて指定する。

ハンズオンは、レベルに応じて 2 パターンのいずれかの方法で進めていきます。

- ARM Template を初めて触る方 : [模範解答](./docs/SampleAnswer.md) に沿ってデプロイの実施
- ARM Template ガチ勢 : 自分で作り方を考えてデプロイにチャレンジし、[模範解答](./docs/SampleAnswer.md) と答え合わせ

### ハンズオンで必要情報

- デプロイする Node.js アプリのパス : https://github.com/dzeyelid/handson-arm-template/blob/develop/functions.zip?raw=true
- Node のバージョン : 10.14.1
- リソースグループの名前 : 皆さんのメールアドレスのアカウント名 (例 hans-schmidt@contoso.com なら ***hans-schmidt***)
- ストレージアカウントの名前 :
    - 皆さんのメールアドレスのアカウント名+sa  (例 hans-schmidt@contoso.com なら ***hansschmidtsa***)
    - 皆さんのメールアドレスのアカウント名+logsa  (例 hans-schmidt@contoso.com なら ***hansschmidtlogsa***)