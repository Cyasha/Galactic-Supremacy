App.Controllers.webgl = (function() {

    var currentStage;
    // Game loop
    var loops = 0,
    nextGameTick = (new Date).getTime(),

    // Constants
    FPS = 60,
    MAX_FRAME_SKIP = 10,
    SKIP_TICKS = 1000 / FPS;

    return {

        // App variables
        renderer:null,        
        projector: null,
        jqDiv:null,
        /*
        Initialize scene
        */
        initialize: function(jqElement) {
            this.jqDiv = jqElement;
            _.bindAll( this, "animate", "render", "update" );

            // Create projector
            this.projector = new THREE.Projector();

            // Create renderer
            this.renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
            this.renderer.setSize( this.jqDiv.width(), this.jqDiv.height() );
            // initialize fps counter
            stats = new Stats(); ;
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.top = '0px';

            this.jqDiv.append(this.renderer.domElement);
            //render the current stage
            currentStage = App.Stages.Galaxy;
            currentStage.initialize(this);
            //event binding
            this.jqDiv.on('mousedown mouseup mousemove dblclick click mousewheel',this._event);

            this.animate();
        },


        /*
        function animate
        Game loop - requests each new frame
        */
        animate: function() {  
            requestAnimationFrame( this.animate ); 
            stats.update();      
            this.render();   
        },



        /*
        function update
        Handles game state updates
        */
        update: function() {
            currentStage.update();
        },


        /*
        function render
        */
        render: function() {
            loops = 0;

            // Attempt to update as many times as possible to get to our nextGameTick 'timeslot'
            // However, we only can update up to 10 times per frame
            while ( (new Date).getTime() > nextGameTick && loops < MAX_FRAME_SKIP ) {
                this.update();
                nextGameTick += SKIP_TICKS;
                loops++;
            }

            // Render our scene
            currentStage.render();

        },
        //gets position in the z plane of a givvent mouse coordinates
        getWorldXYZ:function(camera,xyPosition,z){
            var origin = camera.position;
            var vector =  this.projector.unprojectVector(new THREE.Vector3(xyPosition.x,xyPosition.y,1), camera);

            var scalar =(z - origin.z) / vector.z;
            var intersection = origin.clone().addSelf( vector.multiplyScalar(scalar) );

            debugger;
            return intersection;
        },
        //pass the event handling to proper stage
        _event:function(event,delta){
            currentStage._event(event,delta);
        }
    };
})();