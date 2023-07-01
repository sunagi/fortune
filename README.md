# 占い生成とNFT画像生成のためのAWS LambdaとAPI

このプロジェクトは、AWS Cloudwatchを使用して、AWS Lambda上で `fortune_ai.py` を毎日定期的に実行し、OpenAIのAPIを通じて本日の星座ごとの占い文を生成します。そして、その占い結果を基に、ラッキーアイテムNFTの画像を生成します。生成された画像とそのメタデータは、AWS S3にホスティングされます。

また、AWS Lambdaの `setURI_NFT.py` を使用して、画像とメタデータをNFTとして設定します。これにより、ユーザーがサイトにウォレットアドレスを接続すると、NFTがmintされることができます。

## フロントエンドのデプロイ方法

以下の手順に従って、フロントエンドをデプロイしてください。

1. リポジトリをクローンします。
2. ターミナルで、クローンしたディレクトリ内の `frontend` ディレクトリに移動します。
3. `npm install` を実行して、必要な依存関係をインストールします。
4. `npm run dev` を実行して、開発サーバーを起動します。
5. ブラウザで `http://localhost:5173/` にアクセスします。

以上の手順を完了すると、フロントエンドがローカルで実行され、ウェブサイトにアクセスできるようになります。

ご参考までに、上記手順は一般的な手順であり、環境によっては異なる場合があります。適宜調整してください。
