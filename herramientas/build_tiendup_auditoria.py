import re,json,sys
def prefix_css(css):
    out=[];i=0;n=len(css)
    def pre(sel):
        r=[]
        for x in sel.split(','):
            x=x.strip()
            if not x: continue
            if x.startswith('html') or x.startswith('#aud-lp'): r.append(x)
            elif x==':root': r.append('#aud-lp')
            else: r.append('#aud-lp '+x)
        return ','.join(r)
    def block(css):
        res='';j=0
        while j<len(css):
            k=css.find('{',j)
            if k<0: res+=css[j:];break
            head=css[j:k].strip()
            if head.startswith('@'):
                depth=1;m=k+1
                while depth:
                    if css[m]=='{':depth+=1
                    elif css[m]=='}':depth-=1
                    m+=1
                res+=head+'{'+block(css[k+1:m-1])+'}\n';j=m
            else:
                m=css.find('}',k);res+=pre(head)+'{'+css[k+1:m]+'}\n';j=m+1
        return res
    return block(css)

s=open('auditoria-con-agus/fuente.html',encoding='utf-8').read()
css=re.search(r'<style>(.*?)</style>',s,re.S).group(1)
body=re.search(r'<body>(.*?)<script>\s*document\.addEventListener',s,re.S).group(1)
css=css.replace('*{margin:0;padding:0;box-sizing:border-box}','#aud-lp,#aud-lp *{margin:0;padding:0;box-sizing:border-box}')
css=css.replace('html{scroll-behavior:smooth}','html.aud-lp{scroll-behavior:smooth}')
css=re.sub(r'(?m)^body\{','html.aud-lp body{',css)
css=re.sub(r'(?m)^a\{','#aud-lp a{',css)
css=re.sub(r'(?m)^img\{','#aud-lp img{',css)
css=css.replace('h1,h2,h3{font-family','#aud-lp h1,#aud-lp h2,#aud-lp h3{font-family')
css=re.sub(r'(?m)^nav\{','#aud-lp nav{',css).replace('\nnav .wrap{','\n#aud-lp nav .wrap{')
css=re.sub(r'(?m)^footer\{','#aud-lp footer{',css).replace('\nfooter .wrap{','\n#aud-lp footer .wrap{')
css=css.replace('  nav .wrap{height:60px}','  #aud-lp nav .wrap{height:60px}')
css+='''
html.aud-lp #page-content>*:not(#aud-lp){position:absolute!important;left:-10000px!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important}
html.aud-lp .whatsapp-contact-float-button{display:none!important}
html.aud-lp,html.aud-lp body{background:#F8F0E2!important}
#aud-lp h1 .r,#aud-lp .cta h2 span{color:var(--red)!important}
#aud-lp h2,#aud-lp h3{font-weight:800!important}
#aud-lp .otra{display:block;text-align:center;font-size:12px;color:var(--muted);margin-top:6px;cursor:pointer;text-decoration:underline}
'''
css=prefix_css(css)
TU='https://aguscalcagno.com/s/auditoria-inicial-con-agus'
body=body.replace('href="'+TU+'"','href="#comprar" data-comprar')
body=re.sub(r'href="/(?!/)','href="https://semillaredes.com/',body)
body=body.replace('src="/assets/','src="https://semillaredes.com/assets/').replace('srcset="/assets/','srcset="https://semillaredes.com/assets/')
body=body.replace('WhatsApp</a>\n      </aside>','WhatsApp</a>\n      <a class="otra" data-comprar data-otra href="#comprar"></a>\n      </aside>',1)
assert 'data-otra' in body and TU not in body
html='<div id="aud-lp">'+body.strip()+'</div>'
tpl=open(sys.argv[1],encoding='utf-8').read()
js=tpl.replace('__CSS__',json.dumps(css,ensure_ascii=False)).replace('__HTML__',json.dumps(html,ensure_ascii=False))
open('assets/tiendup-auditoria.js','w',encoding='utf-8').write(js);print(len(js))
