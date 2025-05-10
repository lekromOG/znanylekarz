import pymongo
from mimesis import Person
from mimesis.locales import Locale
from mimesis.enums import Gender
import argparse
import random
from pprint import pprint

"""
To install:
pip3 install -r requirements.txt
"""

DEBUG_URI = "mongodb+srv://krzysio:krzysio1@cluster0.itstbt5.mongodb.net/"

USAGE_STR = 'python3 generate_mock_data.py --count 1 "mongodb+srv://krzysio:krzysio1@cluster0.itstbt5.mongodb.net/" test users'

def gen_user():
    """
    Returns dictionary
    """
    genders = (Gender.FEMALE, Gender.MALE)

    user = Person(Locale.PL)
    full_name = user.full_name(gender=random.choice(genders))
    email = user.email(["krzysio", "lekarz", "gooddoctor", "ziebabrothers", "cudnatury", "cudboga", "illuminati"]) + ".pl"
    first_name = full_name.split(" ")[0]
    last_name = full_name.split(" ")[1]

    return {"name": first_name, "lastname": last_name, "email": email}

def gen_data(count):
    users_generated = []
    for _ in range(int(count)):
        users_generated.append(gen_user())
    return users_generated

def main():
    collection = None

    parser = argparse.ArgumentParser(prog="gen_mock_data", 
                                     description="Generate random data for GoodDoctor db. Example:\n" + USAGE_STR,
                                     epilog="Priopriatery software for GoodDoctor corp.")
    
    parser.add_argument('dburi', help="URI of the database")
    parser.add_argument('dbname', help="Database name to query.")
    parser.add_argument('collectionname', help="Name of the collection to modify.")
    # parser.add_argument('usertype') # for now ignored
    parser.add_argument('-c', '--count', help="How many entries to generate and add to collection")
    parser.add_argument('-x', '--clear', action="store_true", help="Clear the collection. Use this without any other options.")
    parser.add_argument('-p', '--print', action="store_true", help="Print additional information")

    args = parser.parse_args()

    if args.dburi:
        client = pymongo.MongoClient(args.dburi)
        db = client[args.dbname] # test
        collection = db[args.collectionname] # users
        if collection is None:
            print("Couldn't find collection.")
            exit(-1)
        if args.print:
            for document in collection.find():
                pprint(document)

    if args.clear:
        collection.drop()
        print("Collection erased.")
        return

    count = 1
    if args.count:
        count = args.count

    data = gen_data(count)

    if args.print:
        pprint(data)
    collection.insert_many(data)

    print(f"Inserted {args.count} items into {args.collectionname}")

if __name__ == "__main__":
    main()