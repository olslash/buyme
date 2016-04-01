const imageResponse = {
  products: [
    {
      sceneImage: {
        height: 788,
        width: 1400,
        src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/hero_vertex.jpg'
      },
      components: [
        {
          image: {
            height: 1000,
            width: 1000,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/cassette.jpg'
          },
          meta: {
            title: 'SRAM PG-1231 Cassette',
            description: 'a fat ass sram cassette, 11-42',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 840,
            width: 560,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/crank-next.jpg'
          },
          meta: {
            title: 'NEXT crank',
            description: 'a nice crank to spin with your legs',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 994,
            width: 780,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/fork-pike.jpg'
          },
          meta: {
            title: 'RS Pike fork',
            description: 'its a good fork',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 1200,
            width: 1200,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/pedals-xtr-trail.jpg'
          },
          meta: {
            title: 'Shimano XTR Trail Pedals',
            description: 'these are the best pedals seriously',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 663,
            width: 950,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/saddle.jpg'
          },
          meta: {
            title: 'Some saddle 123',
            description: 'This thing is probably not very comfortable',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 1000,
            width: 1000,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/shock-monarch.jpg'
          },
          meta: {
            title: 'RS Monarch shock',
            description: 'Decent shock for your squish bike',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        },
        {
          image: {
            height: 500,
            width: 430,
            src: 'file:///Users/mrobb/Dev/JS/buyme/src/static/images/wheels-mtb.jpg'
          },
          meta: {
            title: 'Stans Wheelset 29er',
            description: 'the hubs are pretty bad but the rims are pretty nice.',
            refLinks: {
              amazon: 'http://www.amazon.com/EVGA-GeForce-Superclocked-Graphics-04G-P4-2974-KR/dp/B00NVODXR4/ref=sr_1_1?s=pc&ie=UTF8&qid=1419042476&sr=1-1&keywords=gtx970'
            }
          }
        }
      ]
    }
  ]
};

imageResponse.products = [
  ...imageResponse.products,
  ...imageResponse.products,
  ...imageResponse.products,
  ...imageResponse.products,
  ...imageResponse.products
];

module.exports = function() {
  return imageResponse;
};
