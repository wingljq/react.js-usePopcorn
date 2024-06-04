import { useEffect } from "react";

export function useKey(Key, action) {

    useEffect(
        function () {
            function callback(e){
                console.log(`e.code:\n${e.code}`);
                console.log(`e.target.value:\n${e.target.value}`);
                console.log(`\n`);

                if (e.code.toLowerCase() === Key.toLowerCase()) {
                    action();                    
                  }
        }

        document.addEventListener('keydown', callback);
          
        return function (){
            document.removeEventListener('keydown',callback)
          };
        },
        [action,Key],
      );
}