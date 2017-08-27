(ns parse-kml
  (:require [clojure.xml :as xml]
            [clojure.string :as str]
            [cheshire.core :as json]))

(defn tagged?
  [tag]
  (comp (partial = tag)
        :tag))

(defn parse-coords
  [coords]
  (-> coords
      (subs 11 (- (count coords) 11))
      (str/split #",")))

(defn parse-kml
  [file]
  (->> (xml/parse file)
       :content
       first
       :content
       (filter (tagged? :Placemark))
       (map (fn [place]
              {(->> place
                    :content
                    (filter (tagged? :name))
                    first
                    :content
                    first)
               (->> place
                    :content
                    (filter (tagged? :Point))
                    first
                    :content
                    first
                    :content
                    first
                    parse-coords)}))
       (apply merge)))

(def data "/Users/pleasetrythisathome/Code/personal/projects/burn-uber/assets/data/")

(comment
 (->> (str data "art/doc.xml")
      parse-kml
      (json/generate-string)
      (spit (str data "art-installations.json")))

 (->> (str data "/brc-facilities.xml")
      parse-kml
      (json/generate-string)
      (spit (str data "brc-facilities.json")))
 )
