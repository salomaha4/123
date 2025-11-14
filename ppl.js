            <div class="row header_in">
                <div class="col-md-4" style="top: 1vh">
                    <div class="row btn-h1">
                        <div class="col-md-2"></div>
                        <!--<div class="col-md-1" style="margin-left: 1.3rem;"> -->
                        <select id="btnBu" class="btn btn-primary btn-circle"></select>
                        <!-- </div> -->
                        <!-- <div class="col-md-1" style="margin-left: 1.3rem;"> -->
                        <select id="select-factory" class="btn btn-primary"
                            style="margin-left: 20px;"></select>
                        <!-- </div> -->
                        <div class="col-md-1 dropdown d-none" style="margin-left: 1.3rem;">
                            <select id="select-team" class="dropbtn btn btn-primary btn-circle">TEAM</select>
                        </div>
                    <div style="margin-left: 1.3rem;">
                            <button class="btn btn-primary btn__fullscreen--in" onclick="goFullScreen()"><i class="fas fa-expand"></i></button>
                            <button class="btn btn-primary btn__fullscreen--out d-none" onclick="goOutFullScreen()"><i class="fas fa-compress"></i></button>
                    </div>    
                    </div>
                </div>
                <div class="col-md-4">
                    <h5 class="text">
                        <!-- Paperless Checklist Statistics -->
                        <spring:message code='paperless.checklist.statistic' />
                    </h5>
                </div>
                <div class="col-md-4 ad" style="top: 1vh; cursor: pointer;">
                    <div class="form-group right float-right py-1 px-4 d-none">
                        <span style="font-family: sans-serif;">Administrator</span>
                        <i class="fas fa-user-circle ml-1"> </i>
                    </div>

                    <div class="input-group float-right css-time-span">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                        </div>
                        <input type="text" class="form-control form-control-sm float-right"id="reservation">
                    </div>
                    <!-- /.form group -->
                </div>
                <img style="position: relative; top: 2.5vh" src="/paperless/assets/images/checklist/header2mini.png"
                    alt="" width="100%">
            </div>
