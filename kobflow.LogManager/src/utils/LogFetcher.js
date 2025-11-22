import  {LogFactory} from "../models/LogFactory"

const sampleLogs = [
  {
    message: "Failed to fetch user data from upstream API.",
    level: 3, // ERROR
    timestamp: new Date("2025-01-21T15:00:00"),
    location: "GatewayController.js:142",
    action: "GET /users/129",
    application: "kobFlow.Gateway",
    service: "Gateway",
  },
  {
    message: "User login successful.",
    level: 1, // INFO
    timestamp: new Date("2025-01-21T14:30:00"),
    location: "AuthService.js:88",
    action: "POST /auth/login",
    application: "kobFlow.Auth",
    service: "Auth",
  },
  {
    message: "Payment timeout while contacting external provider.",
    level: 2, // WARN
    timestamp: new Date("2025-01-21T13:10:00"),
    location: "PaymentService.js:63",
    action: "POST /payments/checkout",
    application: "kobFlow.Payments",
    service: "Payments",
  },
  {
    message: "Database connection pool exceeded max limit.",
    level: 4, // CRITICAL
    timestamp: new Date("2025-01-20T22:45:00"),
    location: "GatewayDB.js:27",
    action: "Query: SELECT * FROM logs LIMIT 5000",
    application: "kobFlow.Gateway",
    service: "Database",
  },
  {
    message: "Refreshing auth tokens for user.",
    level: 1, // INFO
    timestamp: new Date("2025-01-20T18:05:00"),
    location: "TokenManager.js:12",
    action: "Background Task",
    application: "kobFlow.Auth",
    service: "Auth",
  },
  {
    message: "Invalid request payload received from client.",
    level: 2, // WARN
    timestamp: new Date("2025-01-20T12:20:00"),
    location: "GatewayMiddleware.js:55",
    action: "POST /items/create",
    application: "kobFlow.Gateway",
    service: "Gateway",
  },
  {
    message: "Email dispatch successful.",
    level: 1, // INFO
    timestamp: new Date("2025-01-20T09:00:00"),
    location: "EmailService.js:45",
    action: "POST /emails/send",
    application: "kobFlow.Notifications",
    service: "Notifications",
  }
];


function LogFetcher()
{
        const self = this;
        const logFactory  = new LogFactory();

        self.GetAllLogs = function(){

         
            
            return new Promise(function(accept,reject){

               try
               { 
              
                  let result =    sampleLogs.map((el,i)=>{

                        return logFactory.createLogItem({...el});
                    });

                    
                    // simulate async (like calling an API)
                    setTimeout(() => accept(result), 200);
              }
              catch(error)
              {
                reject(error);
              }


            });
        }
}

export {LogFetcher}