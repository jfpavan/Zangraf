import Image from 'next/image';
import Link from 'next/link';
import {ArrowDown, ArrowRight, ArrowUpRight, BookOpen} from 'lucide-react';
import {connection} from 'next/server';
import {ProductCard} from '@/components/product-card';
import {getProducts} from '@/lib/server/catalog';
import {getSiteContent} from '@/lib/server/content';

export default async function Home() {
  await connection();
  const [allProducts, content] = await Promise.all([getProducts(), getSiteContent()]);
  const availableAlbums=allProducts.filter(product=>!product.kind||product.kind==='album');
  const preferred=['album-24x34-antirrisco','album-24x30-acrilico','album-24x24-tecido'];
  const albums=[...preferred.map(id=>availableAlbums.find(product=>product.id===id)).filter((product):product is NonNullable<typeof product>=>!!product),...availableAlbums].filter((product,index,array)=>array.findIndex(item=>item.id===product.id)===index).slice(0,6);
  return <div className="zg-home">
    <section className="zg-hero zg-hero-modern" aria-labelledby="hero-title">
      <div className="zg-hero-copy">
        <span className="zg-eyebrow"><span/> {content.heroEyebrow}</span>
        <h1 id="hero-title">{content.heroTitle}</h1>
        <p>{content.heroDescription}</p>
        <div className="zg-hero-actions"><Link className="button zg-button" href="/albuns">Escolher meu álbum <ArrowUpRight size={18}/></Link><a className="zg-quiet-link" href="#colecoes">Ver os produtos <ArrowDown size={16}/></a></div>
      </div>
      <div className="zg-album-showcase" aria-label="Álbuns produzidos pela Zangraf">
        {albums.slice(0,3).map((album,index)=><Link href={'/albuns/'+album.id} key={album.id} className={'zg-showcase-card card-'+index}>
          <div>{album.imageUrl&&<Image src={album.imageUrl} alt={album.name} fill sizes="(max-width:760px) 65vw, 30vw" unoptimized={!album.imageUrl.startsWith('/')} preload={index===0}/>}</div>
          <span><strong>{album.name}</strong><ArrowUpRight size={18}/></span>
        </Link>)}
      </div>
    </section>

    <section className="zg-category-strip" aria-label="Explore as coleções">
      <Link href="/albuns"><span>Álbuns<small>O lugar das suas histórias</small></span><ArrowUpRight size={23} strokeWidth={1.2}/></Link>
      <Link href="/acessorios"><span>Acessórios<small>Detalhes que acompanham</small></span><ArrowUpRight size={23} strokeWidth={1.2}/></Link>
      <Link href="/estojos"><span>Estojos<small>Uma apresentação especial</small></span><ArrowUpRight size={23} strokeWidth={1.2}/></Link>
    </section>

    <section className="zg-section zg-collection" id="colecoes">
      <div className="zg-section-heading"><div><span className="zg-eyebrow">O SEU OLHAR, EM CADA ESCOLHA</span><h2>Encontre o seu<br/><em>próximo álbum.</em></h2></div><div className="zg-section-aside"><p>Encontre a combinação que traduz suas fotografias. Explore os modelos e conheça cada detalhe.</p></div></div>
      {albums.length ? <div className="zg-product-grid">{albums.map(product => <ProductCard key={product.id} product={product}/>)}</div> : <div className="zg-empty-collection"><BookOpen size={28}/><h3>Novas histórias estão chegando.</h3><p>Em breve, conheça a coleção de álbuns Zangraf.</p></div>}
    </section>

    <section className="zg-section zg-print" aria-labelledby="print-title">
      <div className="zg-print-head"><Image className="zg-print-logo" src="/brand/hp-logo.png" alt="HP" width={64} height={64}/><span className="zg-eyebrow">IMPRESSÃO PROFISSIONAL</span><h2 id="print-title">Impresso em<br/><em>equipamentos HP.</em></h2><p>Todos os álbuns Zangraf são impressos exclusivamente em máquinas HP, para que cada página tenha o mesmo cuidado do início ao fim.</p></div>
      <ul className="zg-print-points">
        <li><strong>Cores fiéis</strong><span>Tons de pele naturais e cores próximas das suas fotos.</span></li>
        <li><strong>Detalhes nítidos</strong><span>Arquivos preparados em 300 DPI para aproveitar a impressão.</span></li>
        <li><strong>Padrão em todas as páginas</strong><span>A mesma qualidade da primeira à última lâmina.</span></li>
      </ul>
    </section>
  </div>;
}
