@include('backend.common.header_main')
            <div class="content-page">
                <div class="content">
                    <div class="container-fluid">
                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box">
                                    <div class="page-title-right">
                                        <ol class="breadcrumb m-0">
                                            <li class="breadcrumb-item"><a href="{{url('admin/dashboard')}}">Dashbord</a></li>
                                            <li class="breadcrumb-item"><a href="{{url('admin/poem/list')}}">Item</a></li>
                                            <li class="breadcrumb-item active">Add Item</li>
                                        </ol>
                                    </div>
                                    <h4 class="page-title">
                                        Add Item
                                    </h4>
                                </div>
                            </div>
                        </div>     
                        <div class="row">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-lg-12 text-right">
                                                <a href="{{url('admin/poem/list')}}" class="btn btn-primary  mb-3">Back To Item</a>
                                            </div>
                                        </div>
                                        <form action="{{url('admin/poem/add')}}" id="add_faq" method="post" enctype="multipart/form-data" >
                                        
                                        @csrf

                                        <div class="row">
                                            <div class="col-lg-6">
                                                <div class="form-group">
                                                    <label>Title</label>
                                                    <input type="text" name="title" class="form-control" placeholder="Enter Title" value="" >
                                                </div>
                                            </div>
                                             <div class="col-lg-6">
                                                <div class="form-group">
                                                    <label class="build_label">Select Poet</label>
                                                    <select name="poet" class="form-control selectPoet">
                                                    <option value="" disabled selected>Select Poet
                                                    </option>
                                                      @foreach($creators as $creator)
                                                          <option value="{{$creator->cname}}">{{@$creator->cname}}</option>
                                                      @endforeach
                                                      <option value="other">Other</option>
                                                    </select>

                                                    <label id="category_id-error" class="error" for="poet_id"></label>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 newCreatorAdded">
                                                <div class="form-group">
                                                    <label>Other poet</label>
                                                    <input type="text" name="otherPoet" class="form-control" placeholder="Enter poet name" value="" >
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div class="form-group">
                                                    <label>Year</label>
                                                    <input type="text" maxlength="4" name="iyear" class="form-control" placeholder="Enter Year" value="" >
                                                </div>
                                            </div>

                                            <div class="col-lg-12">
                                                <div class="form-group">
                                                    <label class="">The Item Description</label>
                                                    <textarea placeholder="Description" class="form-control"  id="description_id" name="description"></textarea>
                                                  <!--   <input class="form-control" id="description_hidden_id" name="description" minlength="20" type="hidden" value=""> -->
                                                    <label class="error mydescclss description_hidden_clss" for="description_hidden_id" style="display: none;">Please enter description</label>
                                                </div>
                                            </div>

                                            <div class="col-lg-6">
                                                <div class="form-group">
                                                    <label>Source Text</label>
                                                    <input type="text" name="source" class="form-control" placeholder="Enter Source Text" value="" >
                                                </div>
                                            </div>

                                             <div class="col-lg-6">
                                                <div class="form-group">
                                                    <label>Source Link</label>
                                                    <input type="text" name="source_link" class="form-control" placeholder="Enter Source Link" value="" >
                                                </div>
                                            </div>
                                            
                                            <div class="col-lg-6">
                                                <div class="form-group mul-cat-main">
                                                    <label class="build_label">Select theme</label>
                                                    <select class="form-control category_id_class mul_category"  name="poem_theme_selected[]" multiple="multiple">
                                                        @foreach($themeList as $theme)
                                                            <option value="{{$theme['item_text']}}">{{@$theme['item_text']}}</option>
                                                        @endforeach
                                                    </select>
                                                    <label id="poem_theme_selected[]-error" class="error" for="poem_theme_selected[]"></label>
                                                </div>
                                            </div>
                                            
                                            <div class="col-lg-6">
                                                <div class="form-group mul-cat-main">
                                                    <label class="build_label">Select mood</label>
                                                    <select class="form-control category_id_class mul_mood"  name="poem_mood_selected[]" multiple="multiple">
                                                        @foreach($moodList as $mood)
                                                            <option value="{{$mood['item_text']}}">{{@$mood['item_text']}}</option>
                                                        @endforeach
                                                    </select>
                                                    <label id="poem_mood_selected[]-error" class="error" for="poem_mood_selected[]"></label>
                                                </div>
                                            </div>

                                            <div class="col-md-12">
                                                <div class="row itemBox">
                                                    <div class="col-md-12">
                                                        <div class="items_size items_prices mb-3">
                                                            <div class="itm_heading mb-3 d-flex align-items-center justify-content-between">
                                                                <h4 class="build_label">Additional URL </h4>
                                                                <a href="javascript:;" class="add_more"><i class="fa fa-plus"></i> Add Additional URL
                                                                </a>
                                                            </div>
                                                           
                                                            <div class="size_chart">
                                                                <div class="apnnd_div">
                                                                    <div class="price_wrap main_div mb-2">
                                                                        <div class="row" part="0">
                                                                        
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> 
                                                    </div>
                                                </div>
                                            </div>
                                            <br>
                                            <br>    

                                            <div class="col-md-12">
                                                <div class="row itemBox">
                                                    <div class="col-md-6">
                                                        <fieldset>
                                                            <h4 class="build_label">Notify me when 10 users add this poem to their collection</h4>
                                                              <div>
                                                                <input type="radio" id="coding" name="notify_via" value="1">
                                                                <label for="coding">By email</label>
                                                              </div>
                                                              
                                                             <!--  <div>
                                                                <input type="radio" id="music" name="notify_via" value="2">
                                                                <label for="music">On my mobile phone</label>
                                                              </div>

                                                              <div>
                                                                <input type="radio" id="coding" name="notify_via" value="3">
                                                                <label for="coding">Both email and mobile phone</label>
                                                              </div> -->
                                                              
                                                              <div>
                                                                <input checked type="radio" id="music" name="notify_via" value="0">
                                                                <label for="music">No, thanks</label>
                                                              </div>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-12">
                                                <div class="form-group text-left">
                                                    <!-- <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"> 
                                                      <label for="vehicle1"> I have a bike</label> --> 

                                                    <div class="">
                                                            <input type="checkbox" id="customCheck_nw" name="poem_in_public_domain" required value="">
                                                        <label>This poem is in the <a href="#"  class="ter_links"> <span data-toggle="tooltip" data-placement="top" data-custom-class="tooltip-success"  title="The poem was published before 1927 and 70 years have passed since the death of the poet.You might be able to find the text of the poem on websites that publish public domain poetry, such as Project Gutenberg.">public domain*</span></a></label>
                                                    </div>
                                                </div>
                                            </div>
                                                
                                            <div class="col-md-12">
                                                <div class="row mt-3">
                                                    <div class="col-12 text-center">
                                                        <button type="submit" class="btn btn-success waves-effect waves-light m-1 addbtnclss"><i class="fe-check-circle mr-1"></i> Submit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div> 
                    </div>
               @include('backend.common.footer')
           </div>
       </div>
       <div class="rightbar-overlay"></div>

    <script type="text/javascript" src="{{url('admin/js/jquery-3.2.1.min.js')}}"></script>
    <script type="text/javascript" src="{{url('admin/js/jquery.validate.js')}}"></script>
    <script type="text/javascript" src="{{url('admin/js/tinymce/tinymce.min.js')}}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.10/js/select2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    
    <script type="text/javascript">

         $(document).ready(function() {
  
        CKEDITOR.replace( 'description' );
            
         });

         
        $(document).on('click','.addbtnclss',function(){
          
           var descdata = CKEDITOR.instances['description_id'].getData();
             console.log('descrrrrrr',descdata);
             if (descdata == '') {
                    console.log('Please provide the contents.');
                $('.description_hidden_clss').show();
                return false;
            }else{
                $('.description_hidden_clss').hide();
                return true;

            }
        });
         
        $('.newCreatorAdded').hide();
        tinymce.init({
            selector: '.textar,.textar1',
            height: 300,
            menubar: true,
            forced_root_block : "", /*to remove auto p tag */
            plugins: [
                'advlist autolink link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media contextmenu paste code'
            ],
             toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
            image_advtab: true,
            /*to take automatic urls starts*/
            relative_urls: false,
            remove_script_host: false,
            /*to take automatic urls ends*/
            file_browser_callback_types: 'file image media',
           
            image_title: true, 
            // enable automatic uploads of images represented by blob or data URIs
            automatic_uploads: true,
            images_upload_url: "{{url('admin/contentManagement/termAndCondtion')}}",

            file_picker_types: 'image media file', 
            setup: function (editor) {
                editor.on('change', function (e) {
                    // alert(editor.getContent());
                    $('textarea[name="'+editor.targetElm.name+'"]').next('input').val($.trim(editor.getContent()));
                });
            },     
            file_picker_callback: function(cb, value, meta) {
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.onchange = function() {
                    var file = this.files[0];

                    var id = 'blobid' + (new Date()).getTime();
                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    var blobInfo = blobCache.create(id, file);
                    blobCache.add(blobInfo);
                    // alert(blobInfo.blobUri());
                    cb(blobInfo.blobUri(), { title: file.name });
                };

               input.click();
            }
        });
    </script>

    <script type="text/javascript">
        $(document).on('change','.selectPoet',function(){
            
            if($(this).val()=='other'){
                // alert('here');
                $('.newCreatorAdded').show();
            }else{
                $('.newCreatorAdded').hide();

            }
        });
    </script>

    <script type="text/javascript">
        
        $(document).on('click', '.add_more', function(){
            var len = $('.main_div').length;

            $('.remove_apnd').hide();
            
            $('.more_prc_inpt').prop('readonly', true);

            $('.apnnd_div').append('<div class="price_wrap main_div mb-2"> <div class="row" part="'+len+'"> <div class="col-lg-6"> <label class="chart_head mb-2">Content</label> <div class="form-group"> <input type="text" class="form-control" id="size_'+len+'" name="price_firsrt_append_div['+len+'][itext]" value="" placeholder="Content"></div></div><div class="col-lg-6"> <label class="chart_head mb-2">URL</label> <div class="form-group"> <input type="text" class="form-control" id="url_'+len+'" name="price_firsrt_append_div['+len+'][url]" value="" placeholder="URL"></div></div></div><p class="text-right mb-0"> <a href="javascript:;" class="remove_apnd"> <i class="fa fa-times"></i> Remove</a></p></div>');

            if (len==0) {
                $('.remove_apnd').hide();
            }

       
            $("input[id^=size_").each(function(){
                $(this).rules("add", {
                    required: true,
                    messages: {
                        required: "Please enter poem text",
                    }
                });   
            });

            $("input[id^=url").each(function(){
                $(this).rules("add", {
                    required: true,
                    messages: {
                        required: "Please enter url",
                    }
                });   
            });

            
        }); 

        $("body").on('click', '.remove_apnd', function(){
            $(this).parents('.main_div').remove();
            var lengt = $('.main_div').length;
            if (lengt>1) {
                $('.main_div').last().find('.remove_apnd').show();
            }
        });
    </script>

    <script type="text/javascript">

        $(function () {
          $('[data-toggle="tooltip"]').tooltip()
        })

    	$(document).ready(function() {


    	    $(".mul_category").select2({
    	        placeholder: "Select Theme"
    	    });

            $(".mul_mood").select2({
                placeholder: "Select Mood"
            });

            
    	});

        $('#add_faq').validate({
         
            ignore:[],
            rules:{
                "title":{
                    required:true,
                },
                "poet":{
                    required: {
                        depends: function(element){
                            if($('.selectPoet').val()=='other'){
                                    return true;
                            } else {
                                    return false;
                            }
                        }
                    },
                },
                // "otherPoet":{
                //     required:true,
                //     remote:"{{ url('admin/check-poet')}}",
                // },
                "iyear":{
                    required:true,
                    number:true,
                    maxlength: 4,
                    digits: true,
                },
                // "description":{
                //     required:true,
                //     minlength:20,
                // },
                "source":{
                    required:true,
                },
                "source_link":{
                    required:true,
                },
                "poem_theme_selected[]":{
                    required:true,
                },
                "poem_mood_selected[]":{
                    required:true,
                },
                "poem_in_public_domain":{
                    required:true,
                },
            },
            messages:{
                "title":{
                    required:"Please enter title",
                },
                'poet':{
                    required:"Please enter poet name",
                },  
                // "otherPoet":{
                //     required:"Please enter other poet name",
                //     remote:"*Poet name already registered",
                // },    
                "iyear":{
                    required:"Please enter year",
                    minlength:"Year must contain 20 characters",
                },
                // "description":{
                //     required:"Please enter description",
                //     minlength:"Description must contain 20 characters",
                // },
                "source":{
                    required:"Please enter source text",
                },
                "source_link":{
                    required:"Please enter source link",
                },
                "poem_theme_selected[]":{
                    required:"Please select public theme"
                },
                "poem_mood_selected[]":{
                    required:"Please select public mood"
                },
                "poem_in_public_domain":{
                    required:"Please select public domain"
                },
            },
        });
    </script>








