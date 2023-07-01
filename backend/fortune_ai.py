from decimal import Decimal
import json
import os
import openai
import random
import boto3
import requests
from io import BytesIO
from datetime import datetime
import re
import time

openai.api_key = os.environ['API_Key']
API_ENDPOINT = 'https://api.openai.com/v1/engine/davinci-codex/completions'
star_signs_jp = ['おひつじ', 'おうし', 'ふたご', 'かに', 'しし', 'おとめ', 'てんびん', 'さそり', 'いて', 'やぎ', 'みずがめ', 'うお']
star_signs_en = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces']
star_signs_dict = dict(zip(star_signs_jp, star_signs_en))
prompts = [
    '座にとって、今日は何を注意するべきでしょうか？',
    '今日の座にとって最良の行動は何でしょうか？',
    '座のための今日の幸運を引き寄せる秘訣は何でしょうか？',
    '座が今日成功を収めるためには何をするべきですか？',
    '座のための今日の穏やかな一日の過ごし方は？',
    '座にとっての今日の最大のチャレンジは何でしょうか？',
    '今日の座のエネルギーレベルはどのようになりそうですか？',
    '座が今日感じる可能性のある感情は何でしょうか？',
    '座にとって、今日はどのような日になりそうですか？',
    '座にとって、今日のリラクゼーションの方法は何でしょうか？',
    '今日、座が最も効果的に行える行動は何ですか？',
    '座の今日の行動ガイドラインは何でしょうか？',
    '今日の座の運気を上げる方法は何ですか？',
    '座が今日取るべきでない行動は何ですか？',
    '座にとって、今日のリーダーシップを発揮する方法は何ですか？',
    '座が今日、社交的に活躍するための方法は何ですか？',
    '座にとって、今日の心地よい休息はどのようなものですか？',
    '今日の座のための究極の自己ケアアクティビティは何ですか？',
    '座にとって、今日の幸せを感じる瞬間は何ですか？',
    '今日、座が体験する可能性のある出来事は何ですか？'
]

def decimal_to_int(obj):
    if isinstance(obj, Decimal):
        return int(obj)

def generate_image(prompt):
    anime_girl_prompt = f"An anime-style girl with expressive eyes and a cute outfit is showing the following advice in a cheerful manner: {prompt}"
    response = openai.Image.create(
        model="image-alpha-001",
        prompt=anime_girl_prompt,
        n=1,
        size="256x256",
        response_format="url"
    )

    return response['data'][0]['url']

s3 = boto3.client('s3')

def upload_metadata_to_s3(metadata, filename):
    metadata_str = json.dumps(metadata, ensure_ascii=False)
    metadata_bytes = metadata_str.encode('utf-8')
    metadata_buffer = BytesIO(metadata_bytes)
    s3.upload_fileobj(metadata_buffer, 'astar', filename)
    metadata_url = f"https://astar.s3.ap-northeast-1.amazonaws.com/{filename}"
    return metadata_url

def lambda_handler(event, context):
    for star_sign_jp in star_signs_jp:
        input_text = random.choice(prompts).replace('座', star_sign_jp)
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k-0613",
            messages=[
                {"role": "user", "content": input_text}, 
            ],
            temperature=0.8
        )
        advice = response["choices"][0]["message"]["content"]
        advice = re.sub(r"\d+\.", "", advice)
        advice = advice.replace('\n\n', ' ')

        # Print the advice
        print(f"Advice for {star_sign_jp}:", advice)

        # 詠唱から生成された画像を取得
        image_url = generate_image(advice)

        # 画像を取得
        response_img = requests.get(image_url)
        img_data = BytesIO(response_img.content)

        # 今日の日付を取得してファイル名を作成
        today = (datetime.today()).strftime('%Y-%m-%d')
        star_sign_en = star_signs_dict[star_sign_jp]
        filename = f"{star_sign_en}_{today}.png"

        # S3に画像をアップロード
        s3.upload_fileobj(img_data, 'astar', filename)

        new_uri = f"https://astar.s3.ap-northeast-1.amazonaws.com/{filename}"

        metadata = {
            "name": f"{star_sign_en}_{today}",
            "description": advice,
            "image": new_uri,
            "attributes": [
                {"trait_type": "star_sign", "value": star_sign_en},
                {"trait_type": "day", "value": today}
            ]
        }

        metadata_filename = f"{star_sign_en}_{today}_metadata.json"
        upload_metadata_to_s3(metadata, metadata_filename)
        time.sleep(10)

    return {
        'statusCode': 200,
        'body': 'Image uploaded successfully!'
    }
