# this file contain the uml function

def get_uml_data(js):
    print("saleem")
    class_dictionary = {}
    classes_names = []
    links = []
    associationClass = []
    for cell in js["cells"]:
        if (cell["type"] == "uml.Class"):
            if (not (cell["position"]["x"] == 1123 and cell["position"]["y"] == 0)):
                class_dictionary[cell["id"]] = cell["name"]
                classes_names.append(cell["name"])
        else:
            if (not (cell["type"] == "basic.Circle")):
                links.append(cell)
            else:
                associationClass.append(cell)
    answer = []
    answer.append(classes_names)
    for i in range(0, len(classes_names)):
        answer.append([0] * len(classes_names))
    for link in links:
        if link["source"]["id"] in class_dictionary:
            if link["target"]["id"] in class_dictionary:
                x = answer[0].index(class_dictionary[link["source"]["id"]])
                y = answer[0].index(class_dictionary[link["target"]["id"]])
                if (class_dictionary[link["source"]["id"]] != class_dictionary[link["target"]["id"]]):
                    answer[x + 1][y] = answer[x + 1][y] + 1
                    answer[y + 1][x] = answer[y + 1][x] + 1
                # self link
                else:
                    answer[x + 1][y] = answer[x + 1][y] + 1
    for asso in associationClass:
        x = answer[0].index(class_dictionary[asso["elementSourceId"]])
        y = answer[0].index(class_dictionary[asso["elementTargetId"]])
        z = answer[0].index(class_dictionary[asso["elementClassAssoceationId"]])
        answer[x + 1][y] = answer[x + 1][y] + 1
        answer[y + 1][x] = answer[y + 1][x] + 1
        answer[x + 1][z] = answer[x + 1][z] + 1
        answer[z + 1][x] = answer[z + 1][x] + 1
        answer[z + 1][y] = answer[z + 1][y] + 1
        answer[y + 1][z] = answer[y + 1][z] + 1
    jsonAnswer = {"data": answer}
    return jsonAnswer