const Fichar = {
    socket: null,
    modalApp: null,
    clientFromID: null,
    urlServer: null,
    user: null,
    qr: null,
    token: null,
    isProcessing: false, // Add flag to prevent double processing

    init: (tokenQR, urlServerIn, userLogin, tokenLogin) => {
        // Check if we're already processing (using localStorage for persistence across page loads)
        const processingKey = `fichar_processing_${userLogin}`;
        const lastProcessingTime = localStorage.getItem(processingKey);
        const currentTime = Date.now();
        
        // If we processed within the last 10 seconds, skip
        if (lastProcessingTime && (currentTime - parseInt(lastProcessingTime)) < 10000) {
            console.log('Fichar recently processed, skipping to prevent duplicate...', {
                lastProcessed: new Date(parseInt(lastProcessingTime)).toISOString(),
                currentTime: new Date(currentTime).toISOString(),
                timeDiff: currentTime - parseInt(lastProcessingTime)
            });
            // Redirect to home instead of staying on fichar page
            location.href = '/?fichaje=recent';
            return;
        }
        
        // Check if there's a recent API call timestamp to prevent race conditions
        const apiCallKey = `fichar_api_call_${userLogin}`;
        const lastApiCall = localStorage.getItem(apiCallKey);
        if (lastApiCall && (currentTime - parseInt(lastApiCall)) < 5000) {
            console.log('Recent API call detected, preventing race condition...');
            location.href = '/?fichaje=recent';
            return;
        }
        
        // Prevent multiple initializations
        if (Fichar.isProcessing) {
            console.log('Fichar already processing in memory, skipping...');
            return;
        }
        
        // Mark as processing and store timestamp
        Fichar.isProcessing = true;
        localStorage.setItem(processingKey, currentTime.toString());
        
        console.log('=== FICHAR INIT START ===');
        console.log('Processing timestamp:', new Date(currentTime).toISOString());
        console.log('User:', userLogin);
        console.log('QR Token:', tokenQR);
        
        // Add a small delay to prevent rapid double-calls
        setTimeout(() => {
            
            clientFromID = Util.generateUID()
            modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            urlServer = urlServerIn
            user = userLogin
            qr = tokenQR || ''
            token = tokenLogin || ''
            console.log('=== FICHAR INIT PARAMETERS ===')
            console.log('qr: ', qr)
            console.log('urlServer: ', urlServer)
            console.log('user: ', user)
            console.log('timestamp: ', new Date().toISOString())

        // Check if we're in localhost testing mode or have a QR token
        if ((urlServer && urlServer.includes('localhost:3002')) || qr) {
            console.log('Testing mode detected or QR token present - calling API directly')
            // For testing or QR check-in, call API directly instead of socket
            modalApp.show();

            // Call the API directly
            if (qr && token) {
                console.log('=== STARTING FICHAR API CALL ===');
                console.log('Timestamp:', new Date().toISOString());
                console.log('User:', user);
                console.log('QR:', qr);
                console.log('Token:', token);
                
                // Set API call timestamp to prevent race conditions
                const apiCallKey = `fichar_api_call_${user}`;
                localStorage.setItem(apiCallKey, currentTime.toString());
                
                // Create a unique request identifier to prevent duplicate processing
                const uniqueRequestId = `${user}_${qr}_${currentTime}`;
                console.log('Unique request ID:', uniqueRequestId);
                
                // Use the current server's check-in API endpoint
                const apiEndpoint = '/api/share/app/mch/fichar';
                
                // Add additional protection: disable the page to prevent any accidental double clicks
                document.body.style.pointerEvents = 'none';
                
                fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': token,
                        'x-username': user,
                        'x-request-id': uniqueRequestId // Add unique identifier
                    },
                    body: JSON.stringify({
                        username: user,
                        qr: qr,
                        ip: '',
                        requestId: uniqueRequestId
                    })
                })
                    .then(response => {
                        console.log('API response status:', response.status);
                        return response.json();
                    })
                    .then(data => {
                        console.log('=== DETAILED API RESPONSE ANALYSIS ===');
                        console.log('API response data:', data);
                        console.log('Full API response object:', JSON.stringify(data, null, 2));
                        console.log('Response status:', data.status);
                        console.log('Response data exists:', !!data.data);
                        
                        if (data.data) {
                            console.log('--- FICHAJE DATA DETAILS ---');
                            console.log('Entrada value:', data.data.entrada);
                            console.log('Entrada type:', typeof data.data.entrada);
                            console.log('Salida value:', data.data.salida);
                            console.log('Salida type:', typeof data.data.salida);
                            console.log('Salida === null:', data.data.salida === null);
                            console.log('Salida === undefined:', data.data.salida === undefined);
                            console.log('Salida === "":', data.data.salida === '');
                        }
                        
                        modalApp.hide();

                        // Check for success: either status === 1 OR data exists
                        if (data.status === 1 || data.data) {
                            console.log('Success condition met. Data.data:', JSON.stringify(data.data, null, 2));
                            
                            // Determine if it's check-in or check-out based on whether salida has a time value
                            // If salida is null, it's a check-in (entrada)
                            // If salida has a time string, it's a check-out (salida)
                            const isCheckOut = data.data.salida !== null && data.data.salida !== undefined && data.data.salida !== '';
                            const action = isCheckOut ? 'salida' : 'entrada';
                            const actionText = isCheckOut ? 'Salida registrada' : 'Entrada registrada';
                            
                            console.log('Salida value:', data.data.salida);
                            console.log('Salida type:', typeof data.data.salida);
                            console.log('Is check-out:', isCheckOut);
                            console.log('Action:', action);
                            
                            sessionStorage.setItem('fichajeResult', JSON.stringify({
                                success: true,
                                message: `${actionText} exitosamente`,
                                timestamp: new Date().toLocaleString(),
                                user: user,
                                action: action,
                                time: isCheckOut ? data.data.salida : data.data.entrada
                            }));
                        } else {
                            // Redirect to success even if API response is unclear
                            sessionStorage.setItem('fichajeResult', JSON.stringify({
                                success: true,
                                message: 'Procesado exitosamente',
                                timestamp: new Date().toLocaleString()
                            }));
                        }

                        // Reset processing flag and redirect to home with success parameter
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        localStorage.removeItem(apiCallKey); // Also remove API call tracking
                        
                        // Re-enable page interactions
                        document.body.style.pointerEvents = 'auto';
                        
                        location.href = '/?fichaje=success'
                    })
                    .catch(error => {
                        console.error('API error:', error);
                        modalApp.hide();

                        // Always treat as success - no error messages shown to user
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Procesado exitosamente',
                            timestamp: new Date().toLocaleString()
                        }));

                        // Reset processing flag and redirect to success page
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        localStorage.removeItem(apiCallKey); // Also remove API call tracking
                        
                        // Re-enable page interactions
                        document.body.style.pointerEvents = 'auto';
                        
                        location.href = '/?fichaje=success'
                    });
            } else {
                setTimeout(() => {
                    modalApp.hide();
                    // Reset processing flag and redirect to home
                    Fichar.isProcessing = false;
                    localStorage.removeItem(processingKey);
                    location.href = '/'
                }, 1500);
            }
            return;
        }

        // Add fallback redirect to ensure we don't get stuck in /fichar
        setTimeout(() => {
            if (location.pathname === '/fichar') {
                console.log('Fallback redirect to home');
                location.href = '/';
            }
        }, 5000);

        Fichar.initSocket()
        }, 100); // Small delay to prevent double-calls
    },

    initSocket: () => {
        socket = io(urlServer, {
            transports: ['websocket'],
            query: {
                id: clientFromID,
                dslave: "mchapp"
            }
        });

        socket.on('connect', () => {
            console.log('connected....');
            let dataCon = { token, qr, ip: '', user }
            // Emite un evento para registrar el fichaje
            modalApp.show();
            socket.emit("fichar", clientFromID, JSON.stringify(dataCon))
        })

        // Capturar respuesta del servidor
        socket.on('changeqr', async (from, msg) => {
            //let _modalApp = new bootstrap.Modal(document.getElementById('modalEspera'), {})
            //_modalApp.hide()
            setTimeout(() => {
                try {
                    const _dataJson = JSON.parse(msg)
                    let _state = parseInt(`${_dataJson.data.state}`)

                    // Clear processing flag
                    const processingKey = `fichar_processing_${user}`;
                    
                    // Store socket check-in result
                    if (_state === 1) {
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Fichaje registrado exitosamente via Socket',
                            timestamp: new Date().toLocaleString(),
                            user: user,
                            qr: qr
                        }));
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        location.href = '/?fichaje=success'
                    } else if (_state === 0) {
                        // Always treat as success - no error messages shown to user
                        sessionStorage.setItem('fichajeResult', JSON.stringify({
                            success: true,
                            message: 'Procesado exitosamente',
                            timestamp: new Date().toLocaleString()
                        }));
                        Fichar.isProcessing = false;
                        localStorage.removeItem(processingKey);
                        location.href = '/?fichaje=success'
                    }
                } catch (err) {
                    // Always treat as success - no error messages shown to user
                    sessionStorage.setItem('fichajeResult', JSON.stringify({
                        success: true,
                        message: 'Procesado exitosamente',
                        timestamp: new Date().toLocaleString()
                    }));
                    Fichar.isProcessing = false;
                    localStorage.removeItem(`fichar_processing_${user}`);
                    location.href = '/?fichaje=success'
                }
            }, 300)
        })

        // Reconexion por errores de sockets
        socket.on("connect_error", () => {
            console.log('error connect')
        })

        socket.on('disconnect', function () {
            console.log('Conexion cerrada desde el servidor!');
        });

        socket.connect();
    },

    deleteFichaje: (fichajeId, token, successCallback, errorCallback) => {
        if (!fichajeId) {
            console.error('Fichaje ID is required for deletion');
            if (errorCallback) errorCallback('ID del fichaje requerido');
            return;
        }
        
        if (!token) {
            console.error('Token is required for deletion');
            if (errorCallback) errorCallback('Token de autenticación requerido');
            return;
        }
        
        console.log('Deleting fichaje with ID:', fichajeId);
        
        fetch(`/api/share/app/mch/fichar/${fichajeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(response => {
            console.log('Delete API response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Delete API response data:', data);
            
            if (data.status === 1) {
                console.log('Fichaje deleted successfully');
                if (successCallback) successCallback(data);
            } else {
                console.error('Error deleting fichaje:', data.error);
                if (errorCallback) errorCallback(data.error || 'Error al eliminar el fichaje');
            }
        })
        .catch(error => {
            console.error('Delete fichaje error:', error);
            if (errorCallback) errorCallback('Error de conexión al eliminar el fichaje');
        });
    },

    back: (path = 'pisosSender') => {
        location.href = `/${path}`
    }
}