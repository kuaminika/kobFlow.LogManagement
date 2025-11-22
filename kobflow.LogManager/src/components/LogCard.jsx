import { useState } from "react"

function LogCard({logItem})
{

    const LOG_LEVELS = {
        1: "INFO",
        2: "WARN",
        3: "ERROR",
        4: "CRITICAL"
        };

    const logColorSet = {
        1 : "bg-white-100 text-green-800",
        2 : "bg-yellow-100 text-yellow-800",
        3 : "bg-red-100 text-red-800",
        4 : "bg-purple-100 text-purple-800"
    }

return     <div className={`${logColorSet[logItem.level]}  shadow rounded-lg p-4 border border-gray-100`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{logItem.timestamp.toLocaleString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border border-gray-400
 ${logColorSet[logItem.level]}`}>
                        {LOG_LEVELS[logItem.level]}
                    </span>
                </div>

                <div className="text-sm text-gray-700 mb-2">
                 <span className="font-semibold">Service:</span> {logItem.service}
                </div>

                <div className="text-sm text-gray-800 line-clamp-3">
               {logItem.message}

          
                </div>

                <div className="flex justify-end mt-3 gap-3">
                    <button className="text-blue-600 hover:underline">View</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                </div>
            </div>

}

export {LogCard}