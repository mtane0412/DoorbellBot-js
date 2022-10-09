# DoorbellBot.js
@L4yLa の[DoorbellBot](https://github.com/L4yLa/TwitchBots/tree/main/DoorbellBot)のNode.js移植版です。
サポートを求められることが多くなってきたり、本家の機能追加とか相談されることも増えてきたので自分でいじれるようにしました。

# 機能
- 配信に来た人の初回のチャットをwaveファイルを再生して通知します。
- レイドメッセージを流します(設定でON/OFF)
- 手動シャウトアウトでシャウトアウトメッセージを流します(設定でON/OFF)
- レイドと手動SOを別々に設定できます
- Twitchのusernameを使って `{username}.wav` という音声ファイルを入れると、その人専用の音声が流れます。
    - デフォルト音声は `default.wav` を置き換えてください
    - mp3は非対応、wavのみです

# 使い方
本家と同じく必要な情報を取得してください。
1. OAuthパスワードの作成 → https://twitchapps.com/tmi/
2. Twitch Developersでアプリケーションを登録してクライアントIDを取得 → https://dev.twitch.tv/
3. このページの[releases](https://github.com/mtane0412/DoorbellBot-js/releases)からzipファイルをダウンロードして解凍
4. config.tomlに必要な情報を記入してください
```
[botInfo]
bot_name = "tanenobot" # Botのusername
channel = "tanenob" # Botを送り込むTwitchチャンネル
TWITCH_TOKEN = "oauth:xxxxxxxx" # oauth: から始まるトークン
CLIENT_ID = "xxxxxxxx"
```
5. main.exeを実行

# SpecialThanks
- [@L4yLa](https://github.com/L4yLa): 本家の開発者の方です
- [Ribenchi](https://www.twitch.tv/ribenchi): デフォルト音声のHiの宇宙猫

# License
MIT