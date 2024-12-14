from predict import predict
from predict import predictToolDia
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import timedelta
from flask_bcrypt import Bcrypt


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict_opti():
    return predict()


# Initialize JWT
app.config['JWT_SECRET_KEY'] = 'jaTt4@Mu4!$a^&gdFS86LNSnfs^mFS4'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=int(15))
jwt = JWTManager(app)

# Initialize Bcrypt
bcrypt = Bcrypt(app)


@app.route('/predictToolDia', methods=['POST'])
def predicttooldia():
    return predictToolDia()

#####Price Factor#####

##### LOGIN #####

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

# Function to register a new user
@app.route('/api/register', methods=['POST'])
@jwt_required()
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({'error': 'Username, password, and role are required'}), 400

    # Check if the username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400

    # Hash the password before storing
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Create a new user instance
    new_user = User(username=username, password=hashed_password, role=role)

    # Add the user to the database session
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

# Function to login
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, password):
        # Generate JWT token
        access_token = create_access_token(identity={'username': username})
        return jsonify({'message': 'Login successful', 'access_token': access_token, 'role': user.role}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401

# Function to get all users
# @app.route('/api/users', methods=['GET'])
# @jwt_required()
# def get_users():
#     users = User.query.all()
#     users_data = [{'id': user.id, 'username': user.username, 'role': user.role} for user in users]
#     return jsonify(users_data), 200


##### LOGIN #####

class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    factor_eps = db.Column(db.Integer, nullable=False, unique=True)
    factor_abrasive = db.Column(db.Integer, nullable=False)
    factor_paint = db.Column(db.Integer, nullable=False)
    factor_printcr = db.Column(db.Integer, nullable=False)
    factor_electronics = db.Column(db.Integer, nullable=False)
    factor_cnccost = db.Column(db.Integer, nullable=False)
    factor_fabfinishcost = db.Column(db.Integer, nullable=False)
    factor_printing = db.Column(db.Integer, nullable=False)

    def update_entry(self,
                     new_factor_eps,
                     new_factor_abrasive,
                     new_factor_paint,
                     new_factor_printcr,
                     new_factor_electronics,
                     new_factor_cnccost,
                     new_factor_fabfinishcost,
                     new_factor_printing,
                     ):
        self.factor_eps = new_factor_eps
        self.factor_abrasive = new_factor_abrasive
        self.factor_paint = new_factor_paint
        self.factor_printcr = new_factor_printcr
        self.factor_electronics = new_factor_electronics
        self.factor_cnccost = new_factor_cnccost
        self.factor_fabfinishcost = new_factor_fabfinishcost
        self.factor_printing = new_factor_printing
        db.session.commit()

    @classmethod
    def get_updated_value(cls):
        entry = cls.query.first()
        if entry:
            return {
                'factor_eps': entry.factor_eps,
                'factor_abrasive': entry.factor_abrasive,
                'factor_paint': entry.factor_paint,
                'factor_printcr': entry.factor_printcr,
                'factor_electronics': entry.factor_electronics,
                'factor_cnccost': entry.factor_cnccost,
                'factor_fabfinishcost': entry.factor_fabfinishcost,
                'factor_printing': entry.factor_printing
            }
        else:
            return None

@app.route('/save_entry', methods=['POST'])
@jwt_required()
def save_entry():
    data = request.get_json()
    new_factor_eps = data.get('factor_eps')
    new_factor_abrasive = data.get('factor_abrasive')
    new_factor_paint = data.get('factor_paint')
    new_factor_printcr = data.get('factor_printcr')
    new_factor_electronics = data.get('factor_electronics')
    new_factor_cnccost = data.get('factor_cnccost')
    new_factor_fabfinishcost = data.get('factor_fabfinishcost')
    new_factor_printing = data.get('factor_printing')

    # Retrieve the single entry from the database
    entry = Entry.query.first()

    if entry:
        # If an entry exists, update its values
        entry.update_entry(
            new_factor_eps,
            new_factor_abrasive,
            new_factor_paint,
            new_factor_printcr,
            new_factor_electronics,
            new_factor_cnccost,
            new_factor_fabfinishcost,
            new_factor_printing
        )
        return jsonify({'message': f'Entry updated successfully'})
    else:
        # If no entry exists, create a new one
        new_entry = Entry(
            factor_eps=new_factor_eps,
            factor_abrasive=new_factor_abrasive,
            factor_paint=new_factor_paint,
            factor_printcr=new_factor_printcr,
            factor_electronics=new_factor_electronics,
            factor_cnccost=new_factor_cnccost,
            factor_fabfinishcost= new_factor_fabfinishcost,
            factor_printing=new_factor_printing
        )
        db.session.add(new_entry)
        db.session.commit()
        return jsonify({'message': f'Entry saved successfully'})

@app.route('/price_factor', methods=['GET'])
@jwt_required()
def get_price_factor():
    price_factor = Entry.get_updated_value()
    if price_factor is not None:
        return jsonify(price_factor)
    else:
        return jsonify({'error': 'Factor value not found'}), 404

#####Price Factor#####

class Client(db.Model):
    __tablename__ = 'clients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Client {self.name}>'

class Estimation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mockupNo = db.Column(db.String(20))
    date = db.Column(db.String(20))

    pltNO = db.Column(db.String(20))
    wipNo = db.Column(db.String(20))
    partNo = db.Column(db.String(20))
    commonDesc = db.Column(db.String(20))
    description = db.Column(db.String(20))
    client = db.Column(db.String(20))
    category = db.Column(db.String(20))
    absAcrylic = db.Column(db.String(20))
    color = db.Column(db.String(20))
    finish = db.Column(db.String(20))
    printCr = db.Column(db.String(20))
    light = db.Column(db.String(20))
    length = db.Column(db.String(20))
    width = db.Column(db.String(20))
    height = db.Column(db.String(20))
    blockHeight = db.Column(db.String(20))
    vol = db.Column(db.String(20))
    area = db.Column(db.String(20))
    stockOptimize = db.Column(db.String(20))
    millingOptimize = db.Column(db.String(20))
    detailingLevel = db.Column(db.String(20))
    printAreaOptimize = db.Column(db.String(20))
    toolDiaA = db.Column(db.String(20))
    qty = db.Column(db.String(20))
    partsAddedTotal = db.Column(db.Float(20))
    package = db.Column(db.String(20))
    freight = db.Column(db.String(20))


    BlockWt = db.Column(db.Float)
    partWt = db.Column(db.Float)
    eps = db.Column(db.Float)
    abrasiveRes = db.Column(db.Float)
    Paint = db.Column(db.Float)
    printPerCr = db.Column(db.Float)
    Electronics = db.Column(db.Float)
    TotalMaterial = db.Column(db.Float)
    Substraction = db.Column(db.Float)
    Removal = db.Column(db.Float)
    BlockSizeArea = db.Column(db.Float)
    toolDiaE = db.Column(db.Float)
    lengthOfCut = db.Column(db.Float)
    NumericalValue = db.Column(db.Float)
    CAD_time = db.Column(db.String(20))
    CNC_Cost = db.Column(db.Float)
    FabInHrs = db.Column(db.String(20))
    FAB_CostinRS = db.Column(db.Float)
    Painting_Hrs = db.Column(db.String(20))
    printing_and_print = db.Column(db.Float)
    subTotal = db.Column(db.Float)
    totalPrice = db.Column(db.Float)
    packaging = db.Column(db.Float)
    basePrice = db.Column(db.Float)
    total = db.Column(db.Float)


@app.route('/api/yourData', methods=['GET'])
@jwt_required()
def get_your_data():
    # data = YourData.query.all()
    data = Estimation.query.all()
    data_list = [{'id': entry.id,
                  'date': entry.date,
                  'mockupNo': entry.mockupNo,
                  'pltNO': entry.pltNO,
                  'wipNo': entry.wipNo,
                  'partNo': entry.partNo,
                  'commonDesc': entry.commonDesc,
                  'description': entry.description,
                  'client': entry.client,
                  'category': entry.category,
                  'absAcrylic': entry.absAcrylic,
                  'color': entry.color,
                  'finish': entry.finish,
                  'printCr': entry.printCr,
                  'light': entry.light,
                  'length': entry.length,
                  'width': entry.width,
                  'height': entry.height,
                  'blockHeight': entry.blockHeight,
                  'vol': entry.vol,
                  'area': entry.area,
                  'stockOptimize': entry.stockOptimize,
                  'millingOptimize': entry.millingOptimize,
                  'detailingLevel': entry.detailingLevel,
                  'printAreaOptimize': entry.printAreaOptimize,
                  'toolDiaA': entry.toolDiaA,
                  'qty': entry.qty,
                  'partsAddedTotal': entry.partsAddedTotal,
                  'package': entry.package,
                  'freight': entry.freight,


                  'BlockWt': entry.BlockWt,
                  'partWt': entry.partWt,
                  'eps': entry.eps,
                  'abrasiveRes': entry.abrasiveRes,
                  'Paint': entry.Paint,
                  'printPerCr': entry.printPerCr,
                  'Electronics': entry.Electronics,
                  'TotalMaterial': entry.TotalMaterial,
                  'Substraction': entry.Substraction,
                  'Removal': entry.Removal,
                  'BlockSizeArea': entry.BlockSizeArea,
                  'toolDiaE': entry.toolDiaE,
                  'lengthOfCut': entry.lengthOfCut,
                  'NumericalValue': entry.NumericalValue,
                  'CAD_time': entry.CAD_time,
                  'CNC_Cost': entry.CNC_Cost,
                  'FabInHrs': entry.FabInHrs,
                  'FAB_CostinRS': entry.FAB_CostinRS,
                  'Painting_Hrs': entry.Painting_Hrs,
                  'printing_and_print': entry.printing_and_print,
                  'subTotal': entry.subTotal,
                  'totalPrice': entry.totalPrice,
                  'packaging': entry.packaging,
                  'basePrice': entry.basePrice,
                  'total': entry.total


                  } for entry in data]
    return jsonify(data_list)

@app.route('/api/yourData', methods=['POST', 'DELETE', 'PUT', 'PATCH'])
@jwt_required()

def handle_post_request():
    if request.method == 'POST':
        data = request.get_json()

        # Extract values from the JSON data
        date = data.get('date')
        mockupNo = data.get('mockupNo')
        pltNO = data.get('pltNO')
        wipNo = data.get('wipNo')
        partNo = data.get('partNo')
        commonDesc = data.get('commonDesc')
        description = data.get('description')
        client = data.get('client')
        category = data.get('category')
        absAcrylic = data.get('absAcrylic')
        color = data.get('color')
        finish = data.get('finish')
        printCr = data.get('printCr')
        light = data.get('light')
        length = data.get('length')
        width = data.get('width')
        height = data.get('height')
        blockHeight = data.get('blockHeight')
        vol = data.get('vol')
        area = data.get('area')
        stockOptimize = data.get('stockOptimize')
        millingOptimize = data.get('millingOptimize')
        detailingLevel = data.get('detailingLevel')
        printAreaOptimize = data.get('printAreaOptimize')
        toolDiaA = data.get('toolDiaA')
        qty = data.get('qty')

        package = data.get('package')
        freight = data.get('freight')

        BlockWt = data.get('BlockWt')
        partWt = data.get('partWt')
        eps = data.get('eps')
        abrasiveRes = data.get('abrasiveRes')
        Paint = data.get('Paint')
        printPerCr = data.get('printPerCr')
        Electronics = data.get('Electronics')
        TotalMaterial = data.get('TotalMaterial')
        Substraction = data.get('Substraction')
        Removal = data.get('Removal')
        BlockSizeArea = data.get('BlockSizeArea')
        toolDiaE = data.get('toolDiaE')
        lengthOfCut = data.get('lengthOfCut')
        NumericalValue = data.get('NumericalValue')
        CAD_time = data.get('CAD_time')
        CNC_Cost = data.get('CNC_Cost')
        FabInHrs = data.get('FabInHrs')
        FAB_CostinRS = data.get('FAB_CostinRS')
        Painting_Hrs = data.get('Painting_Hrs')
        printing_and_print = data.get('printing_and_print')
        subTotal = data.get('subTotal')
        totalPrice = data.get('totalPrice')
        packaging = data.get('packaging')
        basePrice = data.get('basePrice')
        total = data.get('total')

        # Create a new Calculation object
        new_estimate = Estimation(
            date=date,
            mockupNo=mockupNo,
            pltNO=pltNO,
            wipNo=wipNo,
            partNo=partNo,
            commonDesc=commonDesc,
            description=description,
            client=client,
            category=category,
            absAcrylic=absAcrylic,
            color=color,
            finish=finish,
            printCr=printCr,
            light=light,
            length=length,
            width=width,
            height=height,
            blockHeight=blockHeight,
            vol=vol,
            area=area,
            stockOptimize=stockOptimize,
            millingOptimize=millingOptimize,
            detailingLevel=detailingLevel,
            printAreaOptimize=printAreaOptimize,
            toolDiaA=toolDiaA,
            qty=qty,
            package=package,
            freight=freight,

            BlockWt=BlockWt,
            partWt=partWt,
            eps=eps,
            abrasiveRes=abrasiveRes,
            Paint=Paint,
            printPerCr=printPerCr,
            Electronics=Electronics,
            TotalMaterial=TotalMaterial,
            Substraction=Substraction,
            Removal=Removal,
            BlockSizeArea=BlockSizeArea,
            toolDiaE=toolDiaE,
            lengthOfCut=lengthOfCut,
            NumericalValue=NumericalValue,
            CAD_time=CAD_time,
            CNC_Cost=CNC_Cost,
            FabInHrs=FabInHrs,
            FAB_CostinRS=FAB_CostinRS,
            Painting_Hrs=Painting_Hrs,
            printing_and_print=printing_and_print,
            subTotal=subTotal,
            totalPrice=totalPrice,
            packaging=packaging,
            basePrice=basePrice,
            total=total

        )
        # Add the new calculation to the database
        db.session.add(new_estimate)
        db.session.commit()

        # Calculate partsAddedTotal for rows where name1 and name2 are the same
        rows_to_update = Estimation.query.filter_by(pltNO=data['pltNO'], mockupNo=data['mockupNo']).all()
        partsAddedTotal = sum(row.subTotal for row in rows_to_update)
        for row in rows_to_update:
            row.partsAddedTotal = partsAddedTotal
        db.session.commit()



        return jsonify({'status': 'success'})

    elif request.method == 'DELETE':
        data = request.get_json()
        row_id = data.get('id')

        # Check if the ID is provided
        if row_id is None:
            return jsonify({'error': 'ID is required for DELETE request'}), 400

        # Find the row with the given ID
        calculation_to_delete = Estimation.query.get(row_id)

        if calculation_to_delete:
            # Delete the row from the database
            db.session.delete(calculation_to_delete)
            db.session.commit()
            return jsonify({'status': 'success'})
        else:
            return jsonify({'error': 'Row not found'}), 404


    elif request.method in ['PUT', 'PATCH']:
        data = request.get_json()
        row_id = data.get('id')

        # Check if the ID is provided
        if row_id is None:
            return jsonify({'error': 'ID is required for PUT/PATCH request'}), 400

        # Find the row with the given ID
        calculation_to_update = Estimation.query.get(row_id)

        if calculation_to_update:
            # Update the row with the new data
            calculation_to_update.pltNO = data.get('pltNO', calculation_to_update.pltNO)
            calculation_to_update.mockupNo = data.get('mockupNo', calculation_to_update.mockupNo)
            calculation_to_update.wipNo = data.get('wipNo', calculation_to_update.wipNo)
            calculation_to_update.partNo = data.get('partNo', calculation_to_update.partNo)
            calculation_to_update.commonDesc = data.get('commonDesc', calculation_to_update.commonDesc)
            calculation_to_update.description = data.get('description', calculation_to_update.description)
            calculation_to_update.client = data.get('client', calculation_to_update.client)
            calculation_to_update.category = data.get('category', calculation_to_update.category)
            calculation_to_update.absAcrylic = data.get('absAcrylic', calculation_to_update.absAcrylic)
            calculation_to_update.color = data.get('color', calculation_to_update.color)
            calculation_to_update.finish = data.get('finish', calculation_to_update.finish)
            calculation_to_update.printCr = data.get('printCr', calculation_to_update.printCr)
            calculation_to_update.light = data.get('light', calculation_to_update.light)
            calculation_to_update.length = data.get('length', calculation_to_update.length)
            calculation_to_update.width = data.get('width', calculation_to_update.width)
            calculation_to_update.height = data.get('height', calculation_to_update.height)
            calculation_to_update.blockHeight = data.get('blockHeight', calculation_to_update.blockHeight)
            calculation_to_update.vol = data.get('vol', calculation_to_update.vol)
            calculation_to_update.area = data.get('area', calculation_to_update.area)
            calculation_to_update.stockOptimize = data.get('stockOptimize', calculation_to_update.stockOptimize)
            calculation_to_update.millingOptimize = data.get('millingOptimize', calculation_to_update.millingOptimize)
            calculation_to_update.detailingLevel = data.get('detailingLevel', calculation_to_update.detailingLevel)
            calculation_to_update.printAreaOptimize = data.get('printAreaOptimize', calculation_to_update.printAreaOptimize)
            calculation_to_update.toolDiaA = data.get('toolDiaA', calculation_to_update.toolDiaA)
            calculation_to_update.qty = data.get('qty', calculation_to_update.qty)
            # calculation_to_update.partsAddedTotal = data.get('partsAddedTotal', calculation_to_update.partsAddedTotal)
            calculation_to_update.package = data.get('package', calculation_to_update.package)
            calculation_to_update.freight = data.get('freight', calculation_to_update.freight)


            calculation_to_update.BlockWt = data.get('BlockWt', calculation_to_update.BlockWt)
            calculation_to_update.partWt = data.get('partWt', calculation_to_update.partWt)
            calculation_to_update.eps = data.get('eps', calculation_to_update.eps)

            calculation_to_update.abrasiveRes = data.get('abrasiveRes', calculation_to_update.abrasiveRes)
            calculation_to_update.Paint = data.get('Paint', calculation_to_update.Paint)
            calculation_to_update.printPerCr = data.get('printPerCr', calculation_to_update.printPerCr)
            calculation_to_update.Electronics = data.get('Electronics', calculation_to_update.Electronics)
            calculation_to_update.TotalMaterial = data.get('TotalMaterial', calculation_to_update.TotalMaterial)
            calculation_to_update.Substraction = data.get('Substraction', calculation_to_update.Substraction)
            calculation_to_update.Removal = data.get('Removal', calculation_to_update.Removal)
            calculation_to_update.BlockSizeArea = data.get('BlockSizeArea', calculation_to_update.BlockSizeArea)
            calculation_to_update.toolDiaE = data.get('toolDiaE', calculation_to_update.toolDiaE)
            calculation_to_update.lengthOfCut = data.get('lengthOfCut', calculation_to_update.lengthOfCut)
            calculation_to_update.NumericalValue = data.get('NumericalValue', calculation_to_update.NumericalValue)
            calculation_to_update.CAD_time = data.get('CAD_time', calculation_to_update.CAD_time)
            calculation_to_update.CNC_Cost = data.get('CNC_Cost', calculation_to_update.CNC_Cost)
            calculation_to_update.FabInHrs = data.get('FabInHrs', calculation_to_update.FabInHrs)
            calculation_to_update.FAB_CostinRS = data.get('FAB_CostinRS', calculation_to_update.FAB_CostinRS)
            calculation_to_update.Painting_Hrs = data.get('Painting_Hrs', calculation_to_update.Painting_Hrs)
            calculation_to_update.printing_and_print = data.get('printing_and_print', calculation_to_update.printing_and_print)
            calculation_to_update.subTotal = data.get('subTotal', calculation_to_update.subTotal)
            calculation_to_update.totalPrice = data.get('totalPrice', calculation_to_update.totalPrice)
            calculation_to_update.packaging = data.get('packaging', calculation_to_update.packaging)
            calculation_to_update.basePrice = data.get('basePrice', calculation_to_update.basePrice)
            calculation_to_update.total = data.get('total', calculation_to_update.total)


            # Commit the changes to the database
            db.session.commit()

            # Calculate partsAddedTotal for rows where name1 and name2 are the same
            rows_to_update = Estimation.query.filter_by(pltNO=data['pltNO'], mockupNo=data['mockupNo']).all()
            partsAddedTotal = sum(row.subTotal for row in rows_to_update)
            for row in rows_to_update:
                row.partsAddedTotal = partsAddedTotal
            db.session.commit()


            return jsonify({'status': 'success'})
        else:
            return jsonify({'error': 'Row not found'}), 404


# Define the route to add a new client
@app.route('/add_client', methods=['POST'])
@jwt_required()
def add_client():
    data = request.get_json()
    client_name = data['name']

    new_client = Client(name=client_name)
    db.session.add(new_client)
    db.session.commit()

    return jsonify({'message': 'Client added successfully'}), 200

@app.route('/delete_client', methods=['DELETE'])
@jwt_required()
def delete_client():
    data = request.get_json()
    client_name = data['name']

    client = Client.query.filter_by(name=client_name).first()
    if client is None:
        return jsonify({'message': 'Client not found'}), 404

    db.session.delete(client)
    db.session.commit()

    return jsonify({'message': 'Client deleted successfully'}), 200

# Define the route to fetch all clients
@app.route('/get_clients', methods=['GET'])
@jwt_required()
def get_clients():
    clients = Client.query.all()
    client_names = [client.name for client in clients]

    return jsonify({'clients': client_names}), 200


@app.route('/update_values', methods=['POST'])
@jwt_required()
def update_values():
    try:
        data = request.json

        u_commonDesc = data.get('commonDesc')
        new_commonDesc = data.get('new_commonDesc')
        u_mockupNo = data.get('mockupNo')
        new_mockupNo = data.get('new_mockupNo')
        u_pltNO = data.get('pltNO')
        new_pltNO = data.get('new_pltNO')

        # Validate request payload
        if ((u_commonDesc and new_commonDesc) and (u_mockupNo and new_mockupNo) and (u_pltNO and new_pltNO)) or \
           (not (u_commonDesc and new_commonDesc) and not (u_mockupNo and new_mockupNo) and not (u_pltNO and new_pltNO)):
            return jsonify({"error": "Provide either 'commonDesc' and 'new_commonDesc' OR 'mockupNo' and 'new_mockupNo' OR 'pltNO' and 'new_pltNO'"}), 400

        # Execute the update queries based on which set of values is provided
        if u_commonDesc and new_commonDesc:
            db.session.execute(
                text("UPDATE estimation SET commonDesc = :new_commonDesc WHERE commonDesc = :commonDesc"),
                {'new_commonDesc': new_commonDesc, 'commonDesc': u_commonDesc}
            )
        if u_mockupNo and new_mockupNo:
            db.session.execute(
                text("UPDATE estimation SET mockupNo = :new_mockupNo WHERE mockupNo = :mockupNo"),
                {'new_mockupNo': new_mockupNo, 'mockupNo': u_mockupNo}
            )
        if u_pltNO and new_pltNO:
            db.session.execute(
                text("UPDATE estimation SET pltNO = :new_pltNO WHERE pltNO = :pltNO"),
                {'new_pltNO': new_pltNO, 'pltNO': u_pltNO}
            )

        db.session.commit()

        return jsonify({"message": "Values updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/copy_rows', methods=['POST'])
@jwt_required()
def copy_rows():
    data = request.json
    old_pltNO = data.get('old_pltNO')
    new_pltNO = data.get('new_pltNO')

    if not old_pltNO or not new_pltNO:
        return jsonify({'error': 'Please provide both old and new pltNO'}), 400

    # Find all rows with the old pltNO
    rows_to_copy = Estimation.query.filter_by(pltNO=old_pltNO).all()

    if not rows_to_copy:
        return jsonify({'error': f'No rows found with pltNO: {old_pltNO}'}), 404

    # Copy each row and assign the new pltNO
    for row in rows_to_copy:
        # Create a new row, excluding the `id` field
        new_row_data = {col.name: getattr(row, col.name) for col in Estimation.__table__.columns if col.name != 'id'}
        new_row_data['pltNO'] = new_pltNO

        new_row = Estimation(**new_row_data)
        db.session.add(new_row)

    # Commit the new rows to the database
    db.session.commit()

    return jsonify({'message': 'Rows copied successfully'}), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
