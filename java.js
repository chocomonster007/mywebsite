const droite=document.querySelector('#droite')
const gauche=document.querySelector('#gauche')
const portfolio = document.querySelector('#port')
const portable=document.querySelector('#portable')
const liste = document.querySelector('#menuPortable')
const spies = document.querySelectorAll('[data-spy]')
const close = document.querySelector('#close')
const liens = liste.querySelectorAll('a')
const menuOrdi = document.querySelector('#menuOrdi')

const ratio =.3

class CarouselTouch{
    constructor(carousel){
        carousel.panorama.addEventListener('dragstart',e=>e.preventDefault())
        carousel.panorama.addEventListener('mousedown',this.startDrag.bind(this))
        carousel.panorama.addEventListener('touchstart',this.startDrag.bind(this),{passive: true})
        this.carousel =carousel
        window.addEventListener('mousemove',this.drag.bind(this))
        window.addEventListener('touchmove',this.drag.bind(this))
        window.addEventListener('touchend', this.endDrag.bind(this))
        window.addEventListener('mouseup', this.endDrag.bind(this))
        window.addEventListener('touchcancel', this.endDrag.bind(this))



    }
    startDrag(e){
        this.carousel.element.querySelectorAll('a').forEach(lien => lien.addEventListener('click',this.retireLien))
        if(e.touches){
            if(e.touches.length>1){
                return
            }else{
                e =e.touches[0]
            }
        }
        
        this.origin = {x : e.screenX, y: e.screenY}
        this.carousel.disableTransition() 
        this.width = this.carousel.panoWidth
        this.clique = true
    }
    drag(e){
        if(this.origin){
            let point = e.touches ? e.touches[0]:e
            let translation = {x: point.screenX - this.origin.x, y: point.screenY-this.origin.y}
            if(e.touches && Math.abs(translation.x) > Math.abs(translation.y)){
                e.preventDefault()
                e.stopPropagation()
            }
            
            let baseTranslate = this.carousel.currentSlide * -100/this.carousel.items.length
            this.lastTranslate = translation
            this.carousel.panorama.style.transform = `translate3d(${baseTranslate + 100* translation.x/this.width}%,0,0)`
            this.clique = false
        }

    }
    endDrag(e){
            if(this.clique == true){
                this.origin = null
       return this.carousel.element.querySelectorAll('a').forEach(lien => lien.removeEventListener('click',this.retireLien))
        
            }
           
            if(this.origin && this.lastTranslate){
                this.carousel.enableTransition()
                if(Math.abs(this.lastTranslate.x / this.carousel.carouselWidth) >0.2){
                    if(this.lastTranslate.x < 0 ){
                        this.carousel.next()
                    }else{
                        this.carousel.prev()
                    }
                }else{
                    this.carousel.gotoItem(this.carousel.currentSlide)
                }
                this.origin =null
            }
            

           
          
       
        
       
    }

    retireLien(e){
        e.preventDefault()
        e.stopPropagation()
    }

   
    
}

class Carousel{
    constructor(element){
        this.element =element
        this.currentSlide =0
        this.callbacks=[]
        this.items = this.element.querySelectorAll('.pano')
        this.isMobile = false
        this.panorama = this.element.querySelector('.panorama')
        this.nextButton = this.element.querySelector('#droite')
        this.prevButton = this.element.querySelector('#gauche')
        
        
            this.createNavigation()
           this.pagination()
            this.resize()
            this.styleSet()
            window.addEventListener('resize',this.resize.bind(this))
            new CarouselTouch(this)
    }
    createNavigation(){
        this.nextButton.addEventListener('click',this.next.bind(this))
        this.prevButton.addEventListener('click',this.prev.bind(this))
        
    }

    styleSet(){
        let ratio = this.items.length/this.slidesVisible
        this.panorama.style.width = (ratio *100 )+ "%"
        this.items.forEach((item)=>{
            item.style.width = ((100 / this.slidesVisible)/ratio) +"%"
        }  )  }
    
        
    pagination(){
        let buttons = this.element.querySelectorAll('.button')
        buttons[0].classList.add('actif')
        for(let i=0; i<buttons.length; i ++ ){
            buttons[i].addEventListener('click',()=>i==0 ? this.gotoItem(i):this.gotoItem(i+1))
        }
        this.onMove(index=>{
            let activeButton = buttons[Math.floor(index/this.slidesToScroll)]
            if(activeButton){
                buttons.forEach(button=>button.classList.remove('actif'))
                activeButton.classList.add('actif')
            }
        })
    }
    onMove(cb){
        this.callbacks.push(cb)
    }
    next(){
        this.gotoItem(this.currentSlide + this.slidesToScroll)
    }
    prev(){
        
        if(this.currentSlide - this.slidesToScroll<0 && !this.isMobile){
            this.gotoItem(this.items.length - this.slidesVisible+1)
            
        }
        else if(this.currentSlide - this.slidesToScroll<0 && this.isMobile){
            this.gotoItem(this.items.length - this.slidesVisible)
        }
        
        else{
        this.gotoItem(this.currentSlide - this.slidesToScroll)}
        
    }
    gotoItem(index){
        if(this.items[index + this.slidesToScroll -1] == undefined){
            index = 0 
        }

        
        let translateX= index *-100 / this.items.length +"%"
        this.panorama.style.transform = 'translate3d('+translateX+',0,0)'
        this.currentSlide = index
        this.callbacks.forEach(cb =>cb(index))
        
        
    }
    resize(){
        let mobile = window.innerWidth<800
        if(mobile != this.isMobile){
            this.isMobile = mobile
            this.styleSet()
            this.callbacks.forEach(cb=>cb(this.currentSlide))
        }
        if(window.innerWidth>900 && liste.classList[0] == "menuUp"){
            menuOrdi.classList.add('none')
        }
    }
    get slidesToScroll(){
        return this.isMobile ? 1 : 2
    }
    get slidesVisible(){
        return this.isMobile ? 1 : 3
    }
    disableTransition(){
        this.panorama.style.transition ='none'
    }
    enableTransition(){
        this.panorama.style.transition =''
    }
    get panoWidth(){
        return this.panorama.offsetWidth
    }
    get carouselWidth(){
        return this.element.offsetWidth
    }
}

function menuportable(){
        liste.classList.replace('none','menuUp')
        liste.style.height = document.querySelector('body').offsetHeight + 'px'
        }

function closeMenu(){
    if(window.innerWidth > 900){
        menuOrdi.classList.remove('none')
    }
    liste.classList.replace('menuUp','none')
}

close.addEventListener('click',closeMenu)
liens.forEach((lien)=>lien.addEventListener('click',closeMenu))


function activation (element){
    let id = element.getAttribute('id')+"s"
    let anchor = menuOrdi.querySelector(`a[href="#${id}"]`)
    

    document.querySelectorAll('.lienactif').forEach(noeud => noeud.classList.remove('lienactif'))
    anchor.classList.add('lienactif')
}


portable.addEventListener('click', menuportable)

var options = {
    root: null, 
    rootMargin :'0px',
    threshold: ratio
}

const threshold = 0.6
var optionsSection={
    threshold : threshold
}
function observation (entries, observer){
    entries.forEach( function (entry){
        if ( entry.intersectionRatio > ratio){
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
        }
       
       
    })
    
}
function observons (entries, observer){
    entries.forEach(function (entry){
    if ( entry.intersectionRatio > threshold){
        activation(entry.target)
    }})
}

const observer = new IntersectionObserver(observation, options)
const observerSection = new IntersectionObserver(observons, optionsSection)

document.querySelectorAll('[class*="reveal-"]').forEach(function (r){

observer.observe(r)
    
})  

spies.forEach(function(spy){
    observerSection.observe(spy)
})

function ready(){
    new Carousel(document.querySelector('#carousel1'))

}

window.addEventListener('load',ready())
