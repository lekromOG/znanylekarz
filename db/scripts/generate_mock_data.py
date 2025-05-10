import pymongo
from mimesis import Person
from mimesis.locales import Locale
from mimesis.enums import Gender
import argparse
import random
from pprint import pprint

DEBUG_URI = "mongodb+srv://krzysio:krzysio1@cluster0.itstbt5.mongodb.net/"

def gen_user():
    """
    Returns dictionary
    """
    genders = (Gender.FEMALE, Gender.MALE)

    user = Person(Locale.PL)
    full_name = user.full_name(gender=random.choice(genders))
    email = user.email(["krzysie", "lekarz", "gooddoctor", "ziebabrothers", "cudnatury", "cudboga", "illuminati"])
    first_name = full_name.split(" ")[0]
    last_name = full_name.split(" ")[1]

    return {"": first_name, "": last_name, "": email}

def gen_data(count):
    users_generated = []
    for _ in range(count):
        users_generated.append(gen_user())
    return users_generated

def main():
    collection = None

    parser = argparse.ArgumentParser(prog="gen_mock_data", 
                                     description="Generate random data for GoodDoctor db.",
                                     epilog="Priopriatery software for GoodDoctor corp.")
    
    parser.add_argument('dburi')
    # parser.add_argument('usertype') # for now ignored
    parser.add_argument('-c', '--count')
    parser.add_argument('-x', '--clear', action="store_true")
    parser.add_argument('-p', '--print', action="store_true")

    args = parser.parse_args()

    if args.dburi:
        client = pymongo.MongoClient(args.dburi)
        db = client["test"]
        collection = db["users"]
        if collection is None:
            print("Couldn't find collection.")
            exit(-1)
        if args.print:
            for document in collection.find():
                pprint(document)

    count = 1
    if args.count:
        count = args.count

    data = gen_data(count)

    for d in data:
        pass

if __name__ == "__main__":
    main()