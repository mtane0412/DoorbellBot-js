# DoorbellBot.js
@L4yLa の[DoorbellBot](https://github.com/L4yLa/TwitchBots/tree/main/DoorbellBot)のNode.js移植版です。
サポートを求められることが多くなってきたり、本家の機能追加とか相談されることも増えてきたので自分でいじれるようにしました。

## 機能
- 配信に来た人の初回のチャットをwaveファイルを再生して通知します。
- レイドメッセージを流します(設定でON/OFF)
- 手動シャウトアウトでシャウトアウトメッセージを流します(設定でON/OFF)
- レイドと手動SOを別々に設定できます
- Twitchのusernameを使って `{username}.wav` という音声ファイルを入れると、その人専用の音声が流れます。
    - デフォルト音声は `default.wav` を置き換えてください
    - mp3は非対応、wavのみです

## 使い方

### Botに必要な情報の取得
本家と同じく必要な情報を取得してください。
1. OAuthパスワードの作成 → https://twitchapps.com/tmi/
2. Twitch Developersでアプリケーションを登録してクライアントIDを取得 → https://dev.twitch.tv/

### 本体のダウンロード
このページの[releases](https://github.com/mtane0412/DoorbellBot-js/releases)からzipファイルをダウンロードして解凍してください

### 設定ファイルの記述
config.tomlに必要な情報を記入してください。文字列以外の場所に全角スペースを入れるとうまく動かないことがあるので注意。

botInfoに上で取得した情報を記入してください
```
[botInfo]
bot_name = "tanenobot" # Botのusername
channel = "tanenob" # Botを送り込むTwitchチャンネル
TWITCH_TOKEN = "oauth:xxxxxxxx" # oauth: から始まるトークン
CLIENT_ID = "xxxxxxxx" # Twitch Developersで取得したclient_id
# 無視するusernameを入れる
ignore_users= [
    'Nightbot',
    'StreamElements',
    'Streamlabs',
    'tanenobot'
]
```

shout outセクションで、レイド時のメッセージと手動シャウトアウトの設定が行なえます

手動シャウトアウトとレイドシャウトアウト自体のオンオフが個別に設定できます。
オンにするときは `true` を、オフにするときは `false` を入力してください。
```
enable_shoutout = true # shoutoutコマンド時にメッセージを出すか (true / false)
enable_raid_shoutout = true # レイド時にメッセージを出すか  (true / false)
```

シャウトアウトコマンドも設定可能です。
```
shoutout_commands = [
    '!so',
    '!shoutout',
    '!originalshoutout'
]
```

シャウトアウトやレイドメッセージは `"""`の間に記入してください。改行は半角スペースに変換されて、メッセージ全体は一行で送信されます。

```
shoutout_message = """
ここにシャウトアウトメッセージ
"""

raid_message = """
ここにレイドメッセージ
"""
```

メッセージには変数が利用できます。
- `{username}`: Twitchのアルファベットのユーザーネーム(例. 「tanenob」)
- `{displayName}`: Twitchの表示名(例. 「たねのぶ」)
- `{game}`: 【レイド限定】Raiderのゲームカテゴリ (例. 「Pogostuck: Rage With Your Friends」)
- `{title}`: 【レイド限定】Riaderの配信タイトル (例. 「ポゴ楽しい」)
- `{viewers}`: 【レイド限定】レイド時の人数

### 音声の変更
デフォルト音声はsoundsフォルダの`default.wav`を差し替えてください。
soundsフォルダ内にTwitchのusernameを使って`{username}.wav`という音声を追加すると、そのユーザー専用の音声が流れます。

### 起動
main.exeを実行してください。

## Special Thanks
- [@L4yLa](https://github.com/L4yLa): 本家の開発者の方です
- [Ribenchi](https://www.twitch.tv/ribenchi): デフォルト音声のHiの宇宙猫

## License
MIT