from flask import Flask
from flask import request
import json
import pandas as pd
from scipy.spatial.distance import cosine

app = Flask(__name__)

@app.route("/add", methods=["POST"])
def genres():
    request_genres = json.loads(request.data)
    genresData = request_genres['content']
    data_user = genresData

    data = pd.read_csv('data_frame.csv')
    data_item_base = data.drop(['name'], axis=1)

    data_item_base_frame = pd.DataFrame(index=data_item_base.columns, columns=data_item_base.columns)

    for i in range(0, len(data_item_base_frame.columns)):
        for j in range(0, len(data_item_base_frame.columns)):
            data_item_base_frame.iloc[i, j] = 1 - cosine(data.iloc[:, i+1], data.iloc[:, j+1])

    data_item_base_frame.to_csv('data_item_base_frame.csv', sep=',', encoding='utf-8')

    data_neighbors = pd.DataFrame(index=data_item_base_frame.columns, columns = range(1, 6))

    for i in range(0, len(data_item_base_frame.columns)):
        data_neighbors.iloc[i,:5] = data_item_base_frame.iloc[0:, i].sort_values(ascending=False)[:5].index

    rsData = []
    for i in range(0, len(data_item_base_frame.columns)):
        if data_neighbors.index.tolist()[i] in data_user:
            for j in range(1, len(data_neighbors.columns) + 1):
                rsData.append(data_neighbors.iloc[i][j])

    print(list(set(rsData)))

    return {'dataGet': list(set(rsData))}

if __name__ == '__main__':
    app.run(debug=True)